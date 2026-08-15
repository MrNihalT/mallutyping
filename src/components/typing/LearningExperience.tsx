"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    IconCheck,
    IconLock,
    IconPlayerPlay,
    IconStar,
    IconKeyboard,
    IconFlame,
    IconBarbell,
    IconTrophy,
} from "@tabler/icons-react";
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

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                        {lessons.map((lesson) => {
                            const lessonIndex = trainerLessons.findIndex(
                                (item) => item.id === lesson.id,
                            );
                            const completed = completedLessonIds.includes(lesson.id);
                            const locked = lessonIndex > unlockedIndex;

                            // Determine appropriate icon and colored background for each card
                            const title = lesson.title || "";
                            let IconComponent = IconKeyboard;
                            let iconColorClass = "text-sky-600";

                            if (title.includes("പരിശീലനം") || title.includes("പ്രാക്ടീസ്")) {
                                IconComponent = IconBarbell;
                                iconColorClass = "text-amber-600";
                            } else if (title.includes("പരീക്ഷ") || title.includes("പരീക്ഷണം")) {
                                IconComponent = IconTrophy;
                                iconColorClass = "text-emerald-600";
                            } else if (title.includes("വേഗത") || title.includes("ഒഴുക്ക്")) {
                                IconComponent = IconFlame;
                                iconColorClass = "text-rose-600";
                            }

                            if (locked) {
                                iconColorClass = "text-slate-400";
                            }

                            const cardContent = (
                                <div className="p-3 flex flex-col h-full items-center justify-between gap-1">
                                    {/* Top line with Lesson ID and Lock/Check */}
                                    <div className="w-full flex items-center justify-between">
                                        <span className={`text-xs font-black ${locked ? 'text-slate-500' : 'text-slate-800'}`}>
                                            {lesson.id}
                                        </span>
                                        {completed ? (
                                            <span className="text-[#83c60a]">
                                                <IconCheck size={16} stroke={3} />
                                            </span>
                                        ) : locked ? (
                                            <span className="text-slate-600 bg-slate-200/65 p-0.5 rounded-full flex items-center justify-center">
                                                <IconLock size={14} />
                                            </span>
                                        ) : (
                                            <span className="text-sky-500 animate-pulse">
                                                <IconPlayerPlay size={12} fill="currentColor" />
                                            </span>
                                        )}
                                    </div>

                                    {/* Middle Icon and Stars */}
                                    <div className="flex flex-col items-center gap-1.5 my-1">
                                        <div className={iconColorClass}>
                                            <IconComponent size={34} stroke={2.5} />
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <IconStar
                                                    key={i}
                                                    size={10}
                                                    fill={completed ? "#f59e0b" : "none"}
                                                    className={completed ? "text-[#f59e0b]" : "text-slate-200"}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom Title */}
                                    <div className="w-full">
                                        <p className={`font-malayalam font-bold text-[10px] sm:text-xs leading-tight truncate text-center ${locked ? 'text-slate-400' : 'text-slate-700'}`} title={lesson.title}>
                                            {lesson.title}
                                        </p>
                                    </div>
                                </div>
                            );

                            if (locked) {
                                return (
                                    <div
                                        key={lesson.id}
                                        className="border-[2px] border-slate-300 bg-slate-50/50 rounded-[1.2rem] aspect-square flex flex-col justify-between cursor-not-allowed select-none"
                                    >
                                        {cardContent}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={lesson.id}
                                    href={`/lesson/${lesson.id}`}
                                    className="border-[3px] border-black bg-white rounded-[1.2rem] shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] hover:-translate-y-1 transition-all duration-200 aspect-square flex flex-col justify-between"
                                >
                                    {cardContent}
                                </Link>
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
