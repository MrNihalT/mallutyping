"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { IconCheck, IconLock, IconPlayerPlay } from "@tabler/icons-react";
import { trainerLessons } from "@/lib/trainer-lessons";

type RemoteProgressRow = {
    lesson_id: number;
    completed: boolean;
};

function getUnlockedIndex(completedLessonIds: number[]) {
    let unlocked = 0;
    while (unlocked < trainerLessons.length) {
        const nextLessonId = trainerLessons[unlocked]?.id;
        if (!nextLessonId || !completedLessonIds.includes(nextLessonId)) {
            return unlocked;
        }

        unlocked += 1;
    }

    return Math.max(0, trainerLessons.length - 1);
}

export default function LearningExperience() {
    const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
    const [unlockedIndex, setUnlockedIndex] = useState(0);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isHydrating, setIsHydrating] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadProgress() {
            try {
                const response = await fetch("/api/progress", { cache: "no-store" });
                const payload = (await response.json()) as {
                    authenticated: boolean;
                    progress?: RemoteProgressRow[];
                };

                if (cancelled) {
                    return;
                }

                if (!payload.authenticated) {
                    setIsHydrating(false);
                    return;
                }

                const completed = (payload.progress ?? [])
                    .filter((item) => item.completed)
                    .map((item) => item.lesson_id)
                    .sort((left, right) => left - right);

                setCompletedLessonIds(completed);
                setUnlockedIndex(getUnlockedIndex(completed));
                setIsSignedIn(true);
            } finally {
                if (!cancelled) {
                    setIsHydrating(false);
                }
            }
        }

        void loadProgress();

        return () => {
            cancelled = true;
        };
    }, []);

    const progressPercent = Math.round(
        (completedLessonIds.length / trainerLessons.length) * 100,
    );

    const lessonGroups = useMemo(() => {
        const groups = new Map<string, typeof trainerLessons>();
        trainerLessons.forEach((lesson) => {
            const existing = groups.get(lesson.category) ?? [];
            groups.set(lesson.category, [...existing, lesson]);
        });
        return Array.from(groups.entries());
    }, []);

    return (
        <div className="space-y-6">
            <section className="rounded-[2.4rem] border-[3px] border-black bg-white/90 p-6 shadow-[8px_8px_0px_black]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                            Course Map
                        </p>
                        <h2 className="mt-2 text-4xl font-black text-slate-900">
                            Malayalam typing lessons
                        </h2>
                        <p className="mt-3 max-w-3xl text-base font-medium text-slate-600">
                            Start with the first three letters, move into the important
                            Malayalam signs, and unlock the next level only after passing the
                            speed and accuracy requirement.
                        </p>
                    </div>

                    <div className="min-w-[260px] rounded-[1.8rem] border-[3px] border-black bg-[#edf9fb] p-4 shadow-[4px_4px_0px_black]">
                        <p className="text-sm font-black text-slate-700">
                            {progressPercent}% course progress
                        </p>
                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
                            <div
                                className="h-full rounded-full bg-[#c7f43e]"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <p className="mt-3 text-sm font-medium text-slate-600">
                            {isSignedIn
                                ? "Progress sync is active. Completed lessons save automatically."
                                : "Guest mode is active. Login if you want Supabase sync."}
                        </p>
                    </div>
                </div>
            </section>

            {lessonGroups.map(([groupName, lessons]) => (
                <section key={groupName} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                                Level Group
                            </p>
                            <h3 className="text-3xl font-black text-slate-900">{groupName}</h3>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {lessons.map((lesson) => {
                            const lessonIndex = trainerLessons.findIndex(
                                (item) => item.id === lesson.id,
                            );
                            const completed = completedLessonIds.includes(lesson.id);
                            const locked = lessonIndex > unlockedIndex;

                            return (
                                <div
                                    key={lesson.id}
                                    className={`rounded-[1.8rem] border-[3px] border-black bg-white shadow-[5px_5px_0px_black] ${
                                        locked ? "opacity-55" : ""
                                    }`}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                                                    Lesson {lesson.id}
                                                </p>
                                                <h4 className="mt-1 text-2xl font-black text-slate-900">
                                                    {lesson.title}
                                                </h4>
                                            </div>
                                            {completed ? (
                                                <span className="rounded-full bg-[#c7f43e] p-2">
                                                    <IconCheck size={18} />
                                                </span>
                                            ) : locked ? (
                                                <span className="rounded-full bg-slate-100 p-2 text-slate-400">
                                                    <IconLock size={18} />
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-[#eaf9fc] p-2 text-slate-700">
                                                    <IconPlayerPlay size={18} />
                                                </span>
                                            )}
                                        </div>

                                        <p className="font-malayalam mt-5 text-3xl font-semibold text-[#7084a8]">
                                            {lesson.preview}
                                        </p>
                                        <p className="mt-3 min-h-16 text-sm font-medium text-slate-600">
                                            {lesson.summary}
                                        </p>
                                    </div>

                                    <div className="border-t border-slate-200 px-4 py-4">
                                        {locked ? (
                                            <div className="rounded-full border-2 border-black bg-slate-100 px-4 py-3 text-center text-sm font-black text-slate-500">
                                                Complete previous lesson
                                            </div>
                                        ) : (
                                            <Link
                                                href={`/lesson/${lesson.id}`}
                                                className="block rounded-full border-[3px] border-black bg-[#c7f43e] px-4 py-3 text-center text-sm font-black text-slate-900 shadow-[3px_3px_0px_black]"
                                            >
                                                {completed ? "Practice again" : "Start lesson"}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}

            {isHydrating ? (
                <div className="rounded-[1.8rem] border-[3px] border-black bg-white/90 p-4 text-sm font-bold text-slate-700 shadow-[4px_4px_0px_black]">
                    Loading course progress...
                </div>
            ) : null}
        </div>
    );
}
