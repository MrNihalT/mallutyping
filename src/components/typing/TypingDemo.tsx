"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { keyboardRows } from "@/lib/keyboard/malayalam";
import type { TrainerLesson, TrainerPress, TrainerStage } from "@/lib/trainer-lessons";

type StagePassMetrics = {
    accuracy: number;
    wpm: number;
    mistakes: number;
    totalKeys: number;
    timeSpent: number;
};

type TypingDemoProps = {
    lesson: TrainerLesson;
    lessonIndex: number;
    totalLessons: number;
    stage: TrainerStage;
    stageIndex: number;
    totalStages: number;
    soundEnabled: boolean;
    onStagePass: (metrics: StagePassMetrics) => void;
};

const SOUND_URL = "https://keyb.himan.me/sounds/sound.ogg";

function formatHint(press: TrainerPress | null) {
    if (!press) {
        return "START";
    }

    return press.shift ? `Shift + ${press.label}` : press.label;
}

function isShiftCode(code: string) {
    return code === "ShiftLeft" || code === "ShiftRight";
}

function getGraphemeClusters(text: string) {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter("ml", { granularity: "grapheme" });
        return Array.from(segmenter.segment(text)).map((s) => ({
            text: s.segment,
            startIndex: s.index,
            endIndex: s.index + s.segment.length,
        }));
    }
    return text.split("").map((char, index) => ({
        text: char,
        startIndex: index,
        endIndex: index + 1,
    }));
}

export default function TypingDemo({
    lesson,
    lessonIndex,
    totalLessons,
    stage,
    stageIndex,
    totalStages,
    soundEnabled,
    onStagePass,
}: TypingDemoProps) {
    const [unitIndex, setUnitIndex] = useState(0);
    const [pressIndex, setPressIndex] = useState(0);
    const [pressedKeys, setPressedKeys] = useState<string[]>([]);
    const [wrongFlash, setWrongFlash] = useState(false);
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(stage.duration);
    const [correctPresses, setCorrectPresses] = useState(0);
    const [wrongPresses, setWrongPresses] = useState(0);
    const [passed, setPassed] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const soundCutoffRef = useRef<number | null>(null);
    const passTimeoutRef = useRef<number | null>(null);
    const processInputRef = useRef<(code: string, shiftPressed: boolean) => void>(
        () => undefined,
    );

    const currentUnit = stage.units[unitIndex] ?? null;
    const expectedPress = currentUnit?.sequence[pressIndex] ?? null;
    const totalRequiredPresses = useMemo(
        () => stage.units.reduce((sum, item) => sum + item.sequence.length, 0),
        [stage.units],
    );
    const hint = formatHint(expectedPress);

    const accuracy = useMemo(() => {
        const total = correctPresses + wrongPresses;
        if (total === 0) {
            return 100;
        }

        return Math.round((correctPresses / total) * 100);
    }, [correctPresses, wrongPresses]);

    const elapsedSeconds = stage.duration - timeLeft;
    const wpm = useMemo(() => {
        if (elapsedSeconds <= 0) {
            return 0;
        }

        return Math.round((correctPresses / 5 / elapsedSeconds) * 60);
    }, [correctPresses, elapsedSeconds]);

    const playKeySound = useCallback(() => {
        if (!soundEnabled || !audioRef.current) {
            return;
        }

        audioRef.current.currentTime = 0;
        void audioRef.current.play().catch(() => undefined);

        if (soundCutoffRef.current) {
            window.clearTimeout(soundCutoffRef.current);
        }

        soundCutoffRef.current = window.setTimeout(() => {
            if (!audioRef.current) {
                return;
            }

            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }, 65);
    }, [soundEnabled]);

    const flashPressed = useCallback((code: string, shiftPressed: boolean) => {
        const activeCodes = shiftPressed ? [code, "ShiftLeft"] : [code];
        setPressedKeys((current) => [...new Set([...current, ...activeCodes])]);

        window.setTimeout(() => {
            setPressedKeys((current) =>
                current.filter((item) => !activeCodes.includes(item)),
            );
        }, 130);
    }, []);

    const finalizeStage = useCallback(() => {
        const didPass = wpm >= stage.requiredWpm && accuracy >= stage.requiredAccuracy;
        setFinished(true);
        setPassed(didPass);

        if (!didPass) {
            return;
        }

        if (passTimeoutRef.current) {
            window.clearTimeout(passTimeoutRef.current);
        }

        passTimeoutRef.current = window.setTimeout(() => {
            onStagePass({
                accuracy,
                wpm,
                mistakes: wrongPresses,
                totalKeys: totalRequiredPresses,
                timeSpent: Math.max(1, elapsedSeconds),
            });
        }, 900);
    }, [
        accuracy,
        elapsedSeconds,
        onStagePass,
        stage.requiredAccuracy,
        stage.requiredWpm,
        totalRequiredPresses,
        wpm,
        wrongPresses,
    ]);

    const processInput = useCallback(
        (code: string, shiftPressed: boolean) => {
            if (!started || finished || !expectedPress) {
                return;
            }

            const expectedShift = Boolean(expectedPress.shift);

            if (isShiftCode(code)) {
                setPressedKeys((current) =>
                    current.includes(code) ? current : [...current, code],
                );
                return;
            }

            playKeySound();
            flashPressed(code, shiftPressed && expectedShift);

            const matches = code === expectedPress.code && shiftPressed === expectedShift;

            if (!matches) {
                setWrongPresses((current) => current + 1);
                setWrongFlash(true);
                window.setTimeout(() => setWrongFlash(false), 180);
                return;
            }

            setCorrectPresses((current) => current + 1);

            const nextPressIndex = pressIndex + 1;
            if (currentUnit && nextPressIndex < currentUnit.sequence.length) {
                setPressIndex(nextPressIndex);
                return;
            }

            const nextUnitIndex = unitIndex + 1;
            if (nextUnitIndex >= stage.units.length) {
                setUnitIndex(nextUnitIndex);
                setPressIndex(0);
                finalizeStage();
                return;
            }

            setUnitIndex(nextUnitIndex);
            setPressIndex(0);
        },
        [
            currentUnit,
            expectedPress,
            finalizeStage,
            finished,
            flashPressed,
            playKeySound,
            pressIndex,
            stage.units.length,
            started,
            unitIndex,
        ],
    );

    useEffect(() => {
        processInputRef.current = processInput;
    }, [processInput]);

    useEffect(() => {
        audioRef.current = new Audio(SOUND_URL);
        audioRef.current.preload = "auto";
    }, []);

    useEffect(() => {
        if (!started || finished) {
            return;
        }

        const timer = window.setInterval(() => {
            setTimeLeft((current) => {
                if (current <= 1) {
                    window.clearInterval(timer);
                    window.setTimeout(finalizeStage, 0);
                    return 0;
                }

                return current - 1;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [finalizeStage, finished, started]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.repeat || !started || finished) {
                return;
            }

            // Exclude modifier keys from being processed as keyboard input.
            // This prevents modifier keys (like Shift, Control, Alt, CapsLock) from
            // being counted as incorrect presses or triggering wrong flashes.
            if (
                event.code === "ShiftLeft" ||
                event.code === "ShiftRight" ||
                event.code === "ControlLeft" ||
                event.code === "ControlRight" ||
                event.code === "AltLeft" ||
                event.code === "AltRight" ||
                event.code === "MetaLeft" ||
                event.code === "MetaRight" ||
                event.code === "CapsLock"
            ) {
                setPressedKeys((current) =>
                    current.includes(event.code) ? current : [...current, event.code],
                );
                return;
            }

            processInputRef.current(event.code, event.shiftKey);
        }

        function handleKeyUp(event: KeyboardEvent) {
            setPressedKeys((current) => current.filter((code) => code !== event.code));
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [finished, started]);

    return (
        <section className="flex h-full min-h-0 flex-col rounded-[2.4rem] border-[3px] border-black bg-[#dff6fb] p-4 shadow-[8px_8px_0px_black]">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                        Lesson {lessonIndex + 1} of {totalLessons}
                    </p>
                    <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                        {lesson.title}
                    </h1>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                        {stage.title} | Step {stageIndex + 1} of {totalStages}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm font-black text-slate-800">
                    <span className="rounded-full border-2 border-black bg-white px-4 py-2 shadow-[2px_2px_0px_black]">
                        {timeLeft}s
                    </span>
                    <span className="rounded-full border-2 border-black bg-white px-4 py-2 shadow-[2px_2px_0px_black]">
                        {wpm} WPM
                    </span>
                    <span className="rounded-full border-2 border-black bg-white px-4 py-2 shadow-[2px_2px_0px_black]">
                        {accuracy}% ACC
                    </span>
                </div>
            </div>

            <div className="mb-3 flex items-center justify-between gap-3 rounded-[2rem] border-[3px] border-black bg-white px-5 py-4 shadow-[4px_4px_0px_black]">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                        Press This Key
                    </p>
                    <p className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">
                        {hint}
                    </p>
                </div>
                <div className="rounded-full bg-[#c7f43e] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-900">
                    {stage.type}
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
                <div className="rounded-[2rem] bg-white/45 px-4 py-5">
                    <div className="mb-4 flex flex-wrap items-end gap-x-5 gap-y-4">
                        {stage.units.map((unit, index) => {
                            const isCurrent = index === unitIndex;
                            const isDone = index < unitIndex;
                            const clusters = isCurrent ? getGraphemeClusters(unit.text) : [];

                            return (
                                <div
                                    key={`${stage.id}-${unit.text}-${index}`}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <span
                                        className={`rounded-full px-4 py-1 text-xs font-black uppercase tracking-[0.16em] ${
                                            isCurrent
                                                ? "bg-[#c7f43e] text-slate-900"
                                                : isDone
                                                  ? "bg-white text-slate-500"
                                                  : "bg-white/70 text-slate-400"
                                        }`}
                                    >
                                        {unit.sequence
                                            .map((item) =>
                                                item.shift
                                                    ? `Shift+${item.label}`
                                                    : item.label,
                                            )
                                            .join(" ")}
                                    </span>
                                    {isCurrent ? (
                                        <span className="font-malayalam text-4xl font-semibold leading-none sm:text-6xl flex">
                                            {clusters.map((cluster, cIdx) => {
                                                const isFullyTyped = cluster.endIndex <= pressIndex;
                                                const isActive = cluster.startIndex <= pressIndex && pressIndex < cluster.endIndex;

                                                let colorClass = "text-[#bdd0db]";
                                                let borderClass = "border-b-[3px] border-transparent pb-1";

                                                if (isFullyTyped) {
                                                    colorClass = "text-slate-800 font-bold";
                                                } else if (isActive) {
                                                    colorClass = wrongFlash
                                                        ? "text-red-500 animate-pulse"
                                                        : "text-[#7084a8]";
                                                    borderClass = "border-b-[3px] border-[#7084a8] pb-1";
                                                }

                                                return (
                                                    <span
                                                        key={cIdx}
                                                        className={`${colorClass} ${borderClass} transition-all duration-150`}
                                                    >
                                                        {cluster.text}
                                                    </span>
                                                );
                                            })}
                                        </span>
                                    ) : (
                                        <span
                                            className={`font-malayalam text-4xl font-semibold leading-none sm:text-6xl ${
                                                isDone ? "text-slate-700" : "text-[#bdd0db]"
                                            }`}
                                        >
                                            {unit.text}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <p className="font-malayalam text-2xl font-semibold text-[#bdd0db] sm:text-4xl">
                        {stage.nextLine}
                    </p>
                </div>

                {!started ? (
                    <div className="my-4 flex justify-center">
                        <button
                            type="button"
                            onClick={() => setStarted(true)}
                            className="rounded-full border-[3px] border-black bg-[#c7f43e] px-8 py-3 text-lg font-black text-slate-900 shadow-[4px_4px_0px_black]"
                        >
                            Start Lesson
                        </button>
                    </div>
                ) : null}

                {finished ? (
                    <div
                        className={`my-3 rounded-[1.5rem] border-[3px] border-black px-5 py-4 text-sm font-bold shadow-[4px_4px_0px_black] ${
                            passed ? "bg-[#e2ffd6] text-green-800" : "bg-[#ffe3de] text-red-700"
                        }`}
                    >
                        {passed
                            ? `Passed with ${wpm} WPM and ${accuracy}% accuracy.`
                            : `Need ${stage.requiredWpm} WPM and ${stage.requiredAccuracy}% accuracy. Press start and try again.`}
                    </div>
                ) : null}

                <div className="mt-auto overflow-hidden rounded-[2rem] border-[3px] border-black bg-[#596163] p-3">
                    <div className="space-y-2 rounded-[1.3rem] bg-[#6b7375] p-2">
                        {keyboardRows.map((row, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-12 gap-2">
                                {row.map((item) => {
                                    const spanClass =
                                        item.width === "space"
                                            ? "col-span-6"
                                            : item.width === "wide"
                                              ? "col-span-2"
                                              : "col-span-1";
                                    const isPressed = pressedKeys.includes(item.code);
                                    const isExpectedMain = expectedPress
                                        ? item.code === expectedPress.code
                                        : false;
                                    const isExpectedShift =
                                        Boolean(expectedPress?.shift) &&
                                        isShiftCode(item.code);
                                    const baseTone =
                                        item.tone === "accent"
                                            ? "bg-[#a6f113]"
                                            : item.tone === "mint"
                                              ? "bg-[#8ce7ac]"
                                              : "bg-white";

                                    return (
                                        <button
                                            key={`${rowIndex}-${item.code}`}
                                            type="button"
                                            onClick={() => {
                                                if (isShiftCode(item.code)) {
                                                    setPressedKeys((current) =>
                                                        current.includes(item.code)
                                                            ? current
                                                            : [...current, item.code],
                                                    );
                                                    return;
                                                }

                                                processInput(
                                                    item.code,
                                                    Boolean(expectedPress?.shift),
                                                );
                                            }}
                                            className={`${spanClass} h-12 rounded-2xl border border-[#b5f2d1] px-2 py-1 text-center shadow-[0_4px_0_rgba(107,202,153,0.6)] sm:h-14 ${baseTone} ${
                                                isPressed ? "translate-y-[4px] shadow-none" : ""
                                            } ${
                                                isExpectedMain || isExpectedShift
                                                    ? "ring-4 ring-[#c7f43e]/80"
                                                    : ""
                                            }`}
                                        >
                                            {item.normal ? (
                                                <div className="font-malayalam flex h-full flex-col items-center justify-between py-1 text-slate-700">
                                                    <span className="text-[11px] leading-none">
                                                        {item.label}
                                                    </span>
                                                    <span className="text-[14px] font-semibold leading-none">
                                                        {item.normal}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-xs font-medium text-slate-800">
                                                    {item.label}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
