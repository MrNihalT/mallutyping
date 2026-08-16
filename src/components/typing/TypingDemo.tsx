"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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

let globalAudioCtx: AudioContext | null = null;

function getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!globalAudioCtx) {
        const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
            globalAudioCtx = new AudioContextClass();
        }
    }
    return globalAudioCtx;
}

function playSyntheticClick(code?: string) {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    // Resume context if suspended (browser security blocks autoplay without gesture)
    if (ctx.state === "suspended") {
        void ctx.resume();
    }
    
    try {
        // Slight randomized pitch multiplier for natural physical keyboard variation
        const pitchMultiplier = 0.96 + Math.random() * 0.08; 
        
        let freq1 = 1500;
        let freq2 = 280;
        let decayTime = 0.025;
        let volume2 = 0.08;
        
        if (code === "Space") {
            // Spacebar sounds deeper, hollower, and decays slightly slower
            freq1 = 1100;
            freq2 = 180;
            decayTime = 0.035;
            volume2 = 0.12;
        } else if (
            code === "Backspace" || 
            code === "Enter" || 
            code === "ShiftLeft" || 
            code === "ShiftRight" || 
            code === "CapsLock" || 
            code === "Tab"
        ) {
            // Modifiers sound slightly different (clackier, larger keycaps)
            freq1 = 1300;
            freq2 = 220;
            decayTime = 0.03;
            volume2 = 0.09;
        }
        
        // 1. Sharp mechanical switch contact click (tactile bump click)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(freq1 * pitchMultiplier, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(700 * pitchMultiplier, ctx.currentTime + 0.006);
        gain1.gain.setValueAtTime(0.04, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.006);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        
        // 2. Keycap bottoming clack (switch bottom-out sound)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq2 * pitchMultiplier, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(80 * pitchMultiplier, ctx.currentTime + decayTime);
        gain2.gain.setValueAtTime(volume2, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decayTime);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc1.start();
        osc1.stop(ctx.currentTime + 0.006);
        osc2.start();
        osc2.stop(ctx.currentTime + decayTime);
    } catch {
        // ignore
    }
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
    const containerRef = useRef<HTMLDivElement | null>(null);
    const passTimeoutRef = useRef<number | null>(null);
    const processInputRef = useRef<(code: string, shiftPressed: boolean) => void>(
        () => undefined,
    );
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);

    const [prevSoundEnabled, setPrevSoundEnabled] = useState(soundEnabled);
    const [localSoundEnabled, setLocalSoundEnabled] = useState(soundEnabled);

    if (soundEnabled !== prevSoundEnabled) {
        setPrevSoundEnabled(soundEnabled);
        setLocalSoundEnabled(soundEnabled);
    }

    const [isMobile, setIsMobile] = useState(false);
    const [showMobileWarning, setShowMobileWarning] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };
        
        // Defer initial state checks to prevent synchronous setState within the effect body
        window.setTimeout(() => {
            checkMobile();
            if (window.innerWidth < 768) {
                setShowMobileWarning(true);
            }
        }, 0);

        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const isPracticeOrTest = useMemo(() => {
        const title = lesson.title || "";
        const category = lesson.category || "";
        return (
            title.includes("പ്രാക്ടീസ്") ||
            title.includes("പരീക്ഷണം") ||
            title.includes("പുനഃപരിശീലനം") ||
            title.includes("പരീക്ഷ") ||
            title.includes("ഒഴുക്ക്") ||
            title.includes("പരിശീലനം") ||
            category.includes("പ്രാക്ടീസ്") ||
            category.includes("പരീക്ഷണം") ||
            category.includes("പുനഃപരിശീലനം") ||
            category.includes("പരീക്ഷ") ||
            category.includes("ഒഴുക്ക്")
        );
    }, [lesson.title, lesson.category]);

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

    useEffect(() => {
        if (!containerRef.current) return;

        const activeEl = containerRef.current.querySelector('[data-active="true"]') as HTMLElement;
        if (activeEl) {
            const container = containerRef.current;
            const activeOffsetTop = activeEl.offsetTop;

            // Scroll container only when the active word moves to the second line or beyond (typically offsetTop > 80px)
            // This ensures both the active line and the next line are fully visible at the same time
            if (activeOffsetTop > 80) {
                container.scrollTo({
                    top: activeOffsetTop - 12, // Scroll active line to the top, showing it and the next line
                    behavior: "smooth"
                });
            } else {
                container.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        }
    }, [unitIndex]);

    const handleRestart = useCallback(() => {
        setUnitIndex(0);
        setPressIndex(0);
        setPressedKeys([]);
        setWrongFlash(false);
        setStarted(false);
        setFinished(false);
        setTimeLeft(stage.duration);
        setCorrectPresses(0);
        setWrongPresses(0);
        setPassed(false);
        if (passTimeoutRef.current) {
            window.clearTimeout(passTimeoutRef.current);
        }
    }, [stage.duration]);

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

    const playKeySound = useCallback((code?: string) => {
        if (!localSoundEnabled) {
            return;
        }

        // Play high-quality synthetic mechanical click
        playSyntheticClick(code);
    }, [localSoundEnabled]);

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
            if (!started || finished) {
                return;
            }

            // Handle Backspace: Go back one character (within current unit or to previous unit)
            if (code === "Backspace") {
                playKeySound("Backspace");
                if (pressIndex > 0) {
                    setPressIndex(pressIndex - 1);
                    setCorrectPresses((correct) => Math.max(0, correct - 1));
                } else if (unitIndex > 0) {
                    const prevUnitIndex = unitIndex - 1;
                    const prevUnit = stage.units[prevUnitIndex];
                    if (prevUnit) {
                        setUnitIndex(prevUnitIndex);
                        setPressIndex(prevUnit.sequence.length - 1);
                        setCorrectPresses((correct) => Math.max(0, correct - 1));
                    }
                }
                return;
            }

            if (!expectedPress) {
                return;
            }

            const expectedShift = Boolean(expectedPress.shift);

            if (isShiftCode(code)) {
                setPressedKeys((current) =>
                    current.includes(code) ? current : [...current, code],
                );
                return;
            }

            playKeySound(code);
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
            stage.units,
            started,
            unitIndex,
        ],
    );

    useEffect(() => {
        processInputRef.current = processInput;
    }, [processInput]);



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

    const handleHiddenInput = useCallback((event: React.FormEvent<HTMLInputElement>) => {
        const val = event.currentTarget.value;
        if (!val) return;
        
        event.currentTarget.value = "";
        const char = val.slice(-1);
        
        let code = "";
        let shiftPressed = false;
        
        if (char === " ") {
            code = "Space";
        } else if (char === "Backspace") {
            code = "Backspace";
        } else if (/[a-zA-Z]/.test(char)) {
            code = `Key${char.toUpperCase()}`;
            shiftPressed = char === char.toUpperCase();
        } else {
            return;
        }
        
        if (processInputRef.current) {
            processInputRef.current(code, shiftPressed);
        }
    }, []);

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

            // Intercept Backspace to delete the last typed key
            if (event.code === "Backspace" || event.key === "Backspace") {
                processInputRef.current("Backspace", false);
                return;
            }

            if (isMobile) {
                // Ignore other keys on mobile to let hidden input handle them
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
    }, [finished, started, isMobile]);

    return (
        <>
        <section 
            onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName !== "BUTTON" && target.tagName !== "A") {
                    if (hiddenInputRef.current) {
                        hiddenInputRef.current.focus();
                    }
                }
            }}
            className="flex h-full min-h-0 flex-col rounded-[1.5rem] border-[3px] border-black bg-[#dff6fb] p-3 shadow-[5px_5px_0px_black] cursor-pointer"
        >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 leading-none mb-1">
                        Lesson {lessonIndex + 1} of {totalLessons}
                    </p>
                    <h1 className="text-xl font-black text-slate-900 sm:text-2xl leading-none mb-1">
                        {lesson.title}
                    </h1>
                    <p className="text-xs font-semibold text-slate-600 leading-none">
                        {stage.title} | Step {stageIndex + 1} of {totalStages}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs font-black text-slate-800">
                    <button
                        type="button"
                        onClick={() => {
                            playKeySound("Enter");
                            handleRestart();
                        }}
                        className="rounded-full border-2 border-black bg-[#edf9fb] px-3 py-1 shadow-[1.5px_1.5px_0px_black] hover:bg-[#c084fc] hover:text-black active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                    >
                        Restart
                    </button>
                    <Link
                        href="/"
                        className="rounded-full border-2 border-black bg-white px-3 py-1 shadow-[1.5px_1.5px_0px_black] hover:bg-slate-100 active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                    >
                        Lessons Map
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            const newVal = !localSoundEnabled;
                            setLocalSoundEnabled(newVal);
                            if (newVal) {
                                playSyntheticClick("Space");
                            }
                        }}
                        className={`rounded-full border-2 border-black px-3 py-1 shadow-[1.5px_1.5px_0px_black] hover:bg-slate-100 active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer ${
                            localSoundEnabled ? "bg-[#c084fc] text-black" : "bg-red-100 text-red-700"
                        }`}
                    >
                        {localSoundEnabled ? "🔊 Sound: On" : "🔇 Sound: Off"}
                    </button>
                    <span className="rounded-full border-2 border-black bg-white px-3 py-1 shadow-[1.5px_1.5px_0px_black]">
                        {timeLeft}s
                    </span>
                    <span className="rounded-full border-2 border-black bg-white px-3 py-1 shadow-[1.5px_1.5px_0px_black]">
                        {wpm} WPM
                    </span>
                    <span className="rounded-full border-2 border-black bg-white px-3 py-1 shadow-[1.5px_1.5px_0px_black]">
                        {accuracy}% ACC
                    </span>
                </div>
            </div>

            <div className="mb-2 flex items-center justify-between gap-2 rounded-[1rem] border-[3px] border-black bg-white px-4 py-1.5 shadow-[2px_2px_0px_black]">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 leading-none">
                        Press This Key
                    </p>
                    <p className="mt-0.5 text-lg font-black text-slate-900 sm:text-xl leading-none">
                        {hint}
                    </p>
                </div>
                <div className="rounded-full bg-[#c084fc] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                    {stage.type}
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2">
                <div
                    ref={containerRef}
                    className="rounded-[1.5rem] bg-white/45 px-4 py-3 h-[170px] sm:h-[220px] overflow-hidden scroll-smooth relative"
                >
                    <div className="flex flex-wrap items-end gap-x-5 gap-y-4">
                        {stage.units.map((unit, index) => {
                            const isCurrent = index === unitIndex;
                            const isDone = index < unitIndex;
                            const clusters = isCurrent ? getGraphemeClusters(unit.text) : [];

                            return (
                                <div
                                    key={`${stage.id}-${unit.text}-${index}`}
                                    data-active={isCurrent}
                                    className="flex flex-col items-center gap-2"
                                >
                                    {stage.type === "learn" && !isPracticeOrTest && lesson.id <= 44 && (
                                        <span
                                            className={`rounded-full px-4 py-1 text-xs font-black uppercase tracking-[0.16em] ${
                                                isCurrent
                                                    ? "bg-[#c084fc] text-black"
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
                                    )}
                                    {isCurrent ? (
                                        <span className="font-malayalam text-4xl font-semibold leading-none sm:text-6xl flex">
                                            {clusters.map((cluster, cIdx) => {
                                                const isFullyTyped = cluster.endIndex <= pressIndex;
                                                const isActive = cluster.startIndex <= pressIndex && pressIndex < cluster.endIndex;

                                                let colorClass = "text-[#bdd0db]";
                                                let borderClass = "border-b-[3px] border-transparent pb-1";

                                                if (isFullyTyped) {
                                                    colorClass = "text-[#22c55e] font-black";
                                                    borderClass = "border-b-[3px] border-[#22c55e] pb-1";
                                                } else if (isActive) {
                                                    colorClass = wrongFlash
                                                        ? "text-red-500 animate-pulse"
                                                        : "text-[#7084a8]";
                                                    borderClass = "border-b-[3px] border-[#7084a8] pb-1";
                                                }

                                                return (
                                                    <span
                                                        key={cIdx}
                                                        className={`${colorClass} ${borderClass} transition-all duration-150 whitespace-pre`}
                                                    >
                                                        {cluster.text}
                                                    </span>
                                                );
                                            })}
                                        </span>
                                    ) : (
                                        <span
                                            className={`font-malayalam text-4xl font-semibold leading-none sm:text-6xl ${
                                                isDone ? "text-[#22c55e] font-bold" : "text-[#bdd0db]"
                                            }`}
                                        >
                                            {unit.text}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {isMobile && (
                    <div className="my-1.5 text-center text-xs font-black text-slate-500 animate-pulse">
                        {isInputFocused ? "📱 Keyboard active. Start typing!" : "📱 Tap anywhere to open keyboard"}
                    </div>
                )}

                {stage.nextLine && (
                    <p className="font-malayalam text-xl font-semibold text-[#bdd0db] sm:text-2xl px-2 leading-none mt-1">
                        {stage.nextLine}
                    </p>
                )}

                {!started ? (
                    <div className="my-3 flex justify-center">
                        <button
                            type="button"
                            onClick={() => {
                                setStarted(true);
                                playKeySound("Enter");
                            }}
                            className="rounded-full border-[3px] border-black bg-[#c084fc] px-6 py-2.5 text-base font-black text-black shadow-[3px_3px_0px_black] hover:bg-[#b070ec] active:translate-y-[1.5px] active:shadow-none transition-all"
                        >
                            Start Lesson
                        </button>
                    </div>
                ) : null}

                {finished ? (
                    <div
                        className={`my-2 rounded-[1rem] border-[3px] border-black px-4 py-2 text-xs font-bold shadow-[3px_3px_0px_black] ${
                            passed ? "bg-[#e2ffd6] text-green-800" : "bg-[#ffe3de] text-red-700"
                        }`}
                    >
                        {passed
                            ? `Passed with ${wpm} WPM and ${accuracy}% accuracy.`
                            : `Need ${stage.requiredWpm} WPM and ${stage.requiredAccuracy}% accuracy. Press start and try again.`}
                    </div>
                ) : null}

                <div className="mt-6 mb-2 hidden md:block overflow-hidden rounded-[1.8rem] border-[4px] border-[#1e222b] bg-[#1e222b] p-2.5 w-full max-w-[820px] mx-auto shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                    <div className="space-y-1.5 rounded-[1.2rem] bg-[#2d323f] p-2 w-full flex flex-col border-[2px] border-[#282d39]">
                        {keyboardRows.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-1 w-full justify-between">
                                {row.map((item) => {
                                    const flexStyle =
                                        item.code === "Space"
                                            ? { flex: "6.25 6.25 0%" }
                                            : item.code === "Backspace"
                                              ? { flex: "2 2 0%" }
                                              : item.code === "ShiftLeft" || item.code === "ShiftRight"
                                                ? { flex: "2.25 2.25 0%" }
                                                : item.code === "CapsLock"
                                                  ? { flex: "1.75 1.75 0%" }
                                                  : item.code === "Tab"
                                                    ? { flex: "1.5 1.5 0%" }
                                                    : item.tone === "mint"
                                                      ? { flex: "1.25 1.25 0%" }
                                                      : { flex: "1 1 0%" };
                                    const isPressed = pressedKeys.includes(item.code);
                                    const isExpectedMain = expectedPress
                                        ? item.code === expectedPress.code
                                        : false;
                                    const isExpectedShift =
                                        Boolean(expectedPress?.shift) &&
                                        isShiftCode(item.code);
                                    const baseTone =
                                        item.tone === "accent"
                                            ? "bg-[#c084fc] text-black border-[#a855f7] border-b-[#8b5cf6]"
                                            : item.tone === "mint"
                                              ? "bg-[#78db9e] text-slate-800 border-[#5cb882] border-b-[#48976b]"
                                              : "bg-white text-slate-700 border-slate-200 border-b-slate-300";

                                    // Determine the visual tone when pressed (Green = correct, Red = wrong, Gray = modifier)
                                    let bgClass = baseTone;
                                    if (isPressed) {
                                        if (isExpectedMain || isExpectedShift) {
                                            bgClass = "bg-[#22c55e] text-white border-[#166534] border-b-[#166534]"; // Correct (Green)
                                        } else if (
                                            isShiftCode(item.code) ||
                                            item.code === "ControlLeft" ||
                                            item.code === "ControlRight" ||
                                            item.code === "AltLeft" ||
                                            item.code === "AltRight" ||
                                            item.code === "MetaLeft" ||
                                            item.code === "MetaRight" ||
                                            item.code === "CapsLock"
                                        ) {
                                            bgClass = "bg-slate-400 text-white border-slate-600 border-b-slate-600"; // Modifier (Gray)
                                        } else {
                                            bgClass = "bg-[#ef4444] text-white border-[#991b1b] border-b-[#991b1b]"; // Wrong (Red)
                                        }
                                    } else if (isExpectedMain || isExpectedShift) {
                                        // Pulse expected keys (suggestions) in bright violet when not pressed
                                        bgClass = "bg-[#c084fc] text-black border-[#a855f7] border-b-[#8b5cf6] animate-[pulse_1.5s_infinite]";
                                    }

                                    return (
                                        <button
                                            key={`${rowIndex}-${item.code}`}
                                            type="button"
                                            onClick={() => {
                                                playKeySound(item.code);
                                                if (
                                                    isShiftCode(item.code) ||
                                                    item.code === "ControlLeft" ||
                                                    item.code === "ControlRight" ||
                                                    item.code === "AltLeft" ||
                                                    item.code === "AltRight" ||
                                                    item.code === "MetaLeft" ||
                                                    item.code === "MetaRight" ||
                                                    item.code === "CapsLock"
                                                ) {
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
                                            style={flexStyle}
                                            className={`h-8 rounded-[6px] border px-1 py-0.5 text-center transition-all duration-75 sm:h-9 ${bgClass} ${
                                                isPressed
                                                    ? "translate-y-[3px] border-b-[1px] pb-[3.5px]"
                                                    : "translate-y-0 border-b-[4px]"
                                            }`}
                                        >
                                            {item.normal ? (
                                                <div className="flex h-full w-full justify-between items-center px-0.5 py-0.5">
                                                    {/* Left side: English label */}
                                                    <span className="text-[8px] font-bold text-slate-400 leading-none">
                                                        {item.label}
                                                    </span>
                                                    {/* Right side: Malayalam characters (Shift on top, Normal on bottom) */}
                                                    <div className="flex flex-col items-end justify-between h-full font-malayalam select-none">
                                                        <span className="text-[8px] font-medium text-slate-400 leading-none">
                                                            {item.shift || ""}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-800 leading-none">
                                                            {item.normal}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-[9px] font-bold select-none uppercase">
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
            
            {/* Hidden input to capture mobile keyboard typing */}
            <input
                ref={hiddenInputRef}
                type="text"
                value=""
                onChange={handleHiddenInput}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                className="absolute -top-40 left-0 opacity-0 pointer-events-none w-0 h-0"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
            />
        </section>
        
        {/* Mobile Warning Modal */}
        {showMobileWarning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                <div className="w-full max-w-sm rounded-[2rem] border-[3px] border-black bg-white p-6 text-center shadow-[8px_8px_0px_black] animate-in fade-in zoom-in-95 duration-200">
                    <span className="text-4xl">⚠️</span>
                    <h2 className="mt-4 text-2xl font-black text-slate-900">
                        Mobile Notice
                    </h2>
                    <p className="mt-2 text-sm font-bold text-slate-600">
                        MalluTyping is optimized for physical keyboard touch typing.
                        You can try it on mobile, but the experience is limited.
                    </p>
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setShowMobileWarning(false);
                                if (hiddenInputRef.current) {
                                    hiddenInputRef.current.focus();
                                }
                            }}
                            className="w-full rounded-full border-[3px] border-black bg-[#c084fc] py-3 text-sm font-black text-black shadow-[3px_3px_0px_black] hover:bg-[#b070ec] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
                        >
                            Continue Anyway
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
