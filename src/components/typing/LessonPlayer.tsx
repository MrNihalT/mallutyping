"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TypingDemo from "@/components/typing/TypingDemo";
import { trainerLessons } from "@/lib/trainer-lessons";

type RemoteProgressRow = {
    lesson_id: number;
    completed: boolean;
};

type RemoteSettings = {
    sound: boolean;
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

export default function LessonPlayer({ lessonId }: { lessonId: number }) {
    const router = useRouter();
    const lessonIndex = trainerLessons.findIndex((lesson) => lesson.id === lessonId);
    const lesson = trainerLessons[lessonIndex];

    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
    const [unlockedIndex, setUnlockedIndex] = useState(0);
    const [syncMessage, setSyncMessage] = useState("Checking progress...");
    const [isHydrating, setIsHydrating] = useState(true);

    const currentStage = lesson?.stages[currentStageIndex];
    const isLocked = lessonIndex > unlockedIndex;

    useEffect(() => {
        let cancelled = false;

        async function loadProgress() {
            try {
                const response = await fetch("/api/progress", { cache: "no-store" });
                const payload = (await response.json()) as {
                    authenticated: boolean;
                    progress?: RemoteProgressRow[];
                    settings?: RemoteSettings | null;
                };

                if (cancelled) {
                    return;
                }

                const completed = (payload.progress ?? [])
                    .filter((item) => item.completed)
                    .map((item) => item.lesson_id)
                    .sort((left, right) => left - right);

                setCompletedLessonIds(completed);
                setUnlockedIndex(getUnlockedIndex(completed));
                setIsSignedIn(payload.authenticated);
                setSoundEnabled(payload.settings?.sound ?? true);
                setSyncMessage(
                    payload.authenticated
                        ? "Progress sync is active."
                        : "Guest mode is active. Login if you want sync.",
                );
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

    const progressPercent = useMemo(
        () => Math.round((completedLessonIds.length / trainerLessons.length) * 100),
        [completedLessonIds.length],
    );

    if (!lesson) {
        return (
            <div className="rounded-[2rem] border-[3px] border-black bg-white/90 p-6 shadow-[6px_6px_0px_black]">
                <p className="text-lg font-black text-slate-900">Lesson not found.</p>
                <Link href="/" className="mt-4 inline-block font-bold underline">
                    Back to lessons
                </Link>
            </div>
        );
    }

    async function saveLessonCompletion(metrics: {
        accuracy: number;
        wpm: number;
        mistakes: number;
        totalKeys: number;
        timeSpent: number;
    }) {
        if (!isSignedIn) {
            setSyncMessage("Lesson passed in guest mode.");
            return;
        }

        try {
            const response = await fetch("/api/progress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lessonId: lesson.id,
                    accuracy: metrics.accuracy,
                    wpm: metrics.wpm,
                    mistakes: metrics.mistakes,
                    totalKeys: metrics.totalKeys,
                    timeSpent: metrics.timeSpent,
                    stars: metrics.accuracy >= 95 ? 3 : metrics.accuracy >= 90 ? 2 : 1,
                }),
            });

            if (!response.ok) {
                throw new Error("save failed");
            }

            setSyncMessage("Progress saved to Supabase.");
        } catch {
            setSyncMessage("Lesson passed, but saving failed.");
        }
    }

    async function handleStagePass(metrics: {
        accuracy: number;
        wpm: number;
        mistakes: number;
        totalKeys: number;
        timeSpent: number;
    }) {
        const isFinalStage = currentStageIndex === lesson.stages.length - 1;

        if (!isFinalStage) {
            setCurrentStageIndex((current) => current + 1);
            setSyncMessage("Next step unlocked.");
            return;
        }

        await saveLessonCompletion(metrics);

        if (!completedLessonIds.includes(lesson.id)) {
            setCompletedLessonIds((current) => [...current, lesson.id]);
        }

        const nextLesson = trainerLessons[lessonIndex + 1];
        if (nextLesson) {
            window.setTimeout(() => {
                router.push(`/lesson/${nextLesson.id}`);
            }, 700);
            return;
        }

        window.setTimeout(() => {
            router.push("/");
        }, 700);
    }

    return (
        <div className="flex flex-1 min-h-0 flex-col gap-4">
            {isHydrating ? (
                <div className="flex h-full items-center justify-center rounded-[2.4rem] border-[3px] border-black bg-[#dff6fb] p-6 shadow-[8px_8px_0px_black]">
                    <p className="text-lg font-black text-slate-700">Loading lesson...</p>
                </div>
            ) : isLocked ? (
                <div className="flex h-full flex-col items-center justify-center rounded-[2.4rem] border-[3px] border-black bg-[#dff6fb] p-6 text-center shadow-[8px_8px_0px_black]">
                    <p className="text-2xl font-black text-slate-900">
                        Complete the previous lesson first.
                    </p>
                    <Link
                        href="/"
                        className="mt-5 rounded-full border-[3px] border-black bg-[#c7f43e] px-6 py-3 text-sm font-black text-slate-900 shadow-[3px_3px_0px_black]"
                    >
                        Open lesson map
                    </Link>
                </div>
            ) : (
                <TypingDemo
                    key={`${lesson.id}-${currentStage.id}`}
                    lesson={lesson}
                    lessonIndex={lessonIndex}
                    totalLessons={trainerLessons.length}
                    stage={currentStage}
                    stageIndex={currentStageIndex}
                    totalStages={lesson.stages.length}
                    soundEnabled={soundEnabled}
                    onStagePass={handleStagePass}
                />
            )}
        </div>
    );
}
