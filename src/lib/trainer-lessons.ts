export type TrainerPress = {
    code: string;
    label: string;
    shift?: boolean;
};

export type TrainerUnit = {
    text: string;
    sequence: TrainerPress[];
};

export type TrainerStage = {
    id: string;
    type: "learn" | "speed";
    title: string;
    subtitle: string;
    preview: string;
    duration: number;
    requiredWpm: number;
    requiredAccuracy: number;
    nextLine: string;
    units: TrainerUnit[];
};

export type TrainerLesson = {
    id: number;
    slug: string;
    category: string;
    title: string;
    summary: string;
    preview: string;
    focusLabels: string[];
    stages: TrainerStage[];
};

const press = (label: string, code: string, shift = false): TrainerPress => ({
    code,
    label,
    shift,
});

const lesson = (
    id: number,
    slug: string,
    category: string,
    title: string,
    summary: string,
    preview: string,
    focusLabels: string[],
    stages: TrainerStage[],
): TrainerLesson => ({
    id,
    slug,
    category,
    title,
    summary,
    preview,
    focusLabels,
    stages,
});

export const trainerLessons: TrainerLesson[] = [
    lesson(
        1,
        "first-vowels",
        "അടിസ്ഥാനം",
        "സ്വരങ്ങൾ 1",
        "Start with the first three Malayalam letters and learn the Shift pattern clearly.",
        "അ ആ ഇ",
        ["Shift + D", "Shift + E", "Shift + F"],
        [
            {
                id: "lesson-1-learn",
                type: "learn",
                title: "Learn അ ആ ഇ",
                subtitle: "First three letters",
                preview: "അ ആ ഇ",
                duration: 30,
                requiredWpm: 7,
                requiredAccuracy: 85,
                nextLine: "അ ആ ഇ അ ആ ഇ",
                units: [
                    { text: "അ", sequence: [press("D", "KeyD", true)] },
                    { text: "ആ", sequence: [press("E", "KeyE", true)] },
                    { text: "ഇ", sequence: [press("F", "KeyF", true)] },
                    {
                        text: "അആഇ",
                        sequence: [
                            press("D", "KeyD", true),
                            press("E", "KeyE", true),
                            press("F", "KeyF", true),
                        ],
                    },
                ],
            },
            {
                id: "lesson-1-speed",
                type: "speed",
                title: "Improve Speed",
                subtitle: "First letter speed check",
                preview: "അആഇ",
                duration: 40,
                requiredWpm: 10,
                requiredAccuracy: 88,
                nextLine: "അആഇ ഇആഅ അഇആ",
                units: [
                    {
                        text: "അആഇ",
                        sequence: [
                            press("D", "KeyD", true),
                            press("E", "KeyE", true),
                            press("F", "KeyF", true),
                        ],
                    },
                    {
                        text: "ഇആഅ",
                        sequence: [
                            press("F", "KeyF", true),
                            press("E", "KeyE", true),
                            press("D", "KeyD", true),
                        ],
                    },
                    {
                        text: "അഇആ",
                        sequence: [
                            press("D", "KeyD", true),
                            press("F", "KeyF", true),
                            press("E", "KeyE", true),
                        ],
                    },
                ],
            },
        ],
    ),
    lesson(
        2,
        "chihnangal",
        "അടിസ്ഥാനം",
        "ചിഹ്നങ്ങൾ",
        "Learn the important Malayalam signs before moving deeper into words.",
        "ാ ി ു",
        ["E", "F", "G"],
        [
            {
                id: "lesson-2-learn",
                type: "learn",
                title: "Learn ാ ി ു",
                subtitle: "Important signs",
                preview: "ാ ി ു",
                duration: 30,
                requiredWpm: 8,
                requiredAccuracy: 85,
                nextLine: "ാ ി ു ാ ി ു",
                units: [
                    { text: "ാ", sequence: [press("E", "KeyE")] },
                    { text: "ി", sequence: [press("F", "KeyF")] },
                    { text: "ു", sequence: [press("G", "KeyG")] },
                    {
                        text: "ാിു",
                        sequence: [
                            press("E", "KeyE"),
                            press("F", "KeyF"),
                            press("G", "KeyG"),
                        ],
                    },
                ],
            },
            {
                id: "lesson-2-speed",
                type: "speed",
                title: "Improve Speed",
                subtitle: "Sign rhythm drill",
                preview: "ാിു",
                duration: 40,
                requiredWpm: 11,
                requiredAccuracy: 88,
                nextLine: "ാിു ുിാ ിുാ",
                units: [
                    {
                        text: "ാിു",
                        sequence: [
                            press("E", "KeyE"),
                            press("F", "KeyF"),
                            press("G", "KeyG"),
                        ],
                    },
                    {
                        text: "ുിാ",
                        sequence: [
                            press("G", "KeyG"),
                            press("F", "KeyF"),
                            press("E", "KeyE"),
                        ],
                    },
                    {
                        text: "ിുാ",
                        sequence: [
                            press("F", "KeyF"),
                            press("G", "KeyG"),
                            press("E", "KeyE"),
                        ],
                    },
                ],
            },
        ],
    ),
    lesson(
        3,
        "second-vowels",
        "അടിസ്ഥാനം",
        "സ്വരങ്ങൾ 2",
        "Bring in the next vowel block and keep your hands relaxed.",
        "ഈ ഉ ഊ",
        ["Shift + R", "Shift + G", "Shift + T"],
        [
            {
                id: "lesson-3-learn",
                type: "learn",
                title: "Learn ഈ ഉ ഊ",
                subtitle: "Second vowel block",
                preview: "ഈ ഉ ഊ",
                duration: 34,
                requiredWpm: 8,
                requiredAccuracy: 85,
                nextLine: "ഈ ഉ ഊ ഈ ഉ ഊ",
                units: [
                    { text: "ഈ", sequence: [press("R", "KeyR", true)] },
                    { text: "ഉ", sequence: [press("G", "KeyG", true)] },
                    { text: "ഊ", sequence: [press("T", "KeyT", true)] },
                    {
                        text: "ഈഉഊ",
                        sequence: [
                            press("R", "KeyR", true),
                            press("G", "KeyG", true),
                            press("T", "KeyT", true),
                        ],
                    },
                ],
            },
            {
                id: "lesson-3-speed",
                type: "speed",
                title: "Improve Speed",
                subtitle: "Second vowel speed check",
                preview: "ഈഉഊ",
                duration: 42,
                requiredWpm: 11,
                requiredAccuracy: 88,
                nextLine: "ഈഉഊ ഊഉഈ ഈഊഉ",
                units: [
                    {
                        text: "ഈഉഊ",
                        sequence: [
                            press("R", "KeyR", true),
                            press("G", "KeyG", true),
                            press("T", "KeyT", true),
                        ],
                    },
                    {
                        text: "ഊഉഈ",
                        sequence: [
                            press("T", "KeyT", true),
                            press("G", "KeyG", true),
                            press("R", "KeyR", true),
                        ],
                    },
                    {
                        text: "ഈഊഉ",
                        sequence: [
                            press("R", "KeyR", true),
                            press("T", "KeyT", true),
                            press("G", "KeyG", true),
                        ],
                    },
                ],
            },
        ],
    ),
    lesson(
        4,
        "simple-words-1",
        "വാക്കുകൾ",
        "ക മ ല",
        "Move into short Malayalam word building with clean everyday letters.",
        "കല മല മാല",
        ["K", "C", "N"],
        [
            {
                id: "lesson-4-learn",
                type: "learn",
                title: "Learn ക മ ല",
                subtitle: "First word set",
                preview: "ക മ ല",
                duration: 38,
                requiredWpm: 9,
                requiredAccuracy: 85,
                nextLine: "കല മല മാല",
                units: [
                    { text: "ക", sequence: [press("K", "KeyK")] },
                    { text: "മ", sequence: [press("C", "KeyC")] },
                    { text: "ല", sequence: [press("N", "KeyN")] },
                    { text: "കല", sequence: [press("K", "KeyK"), press("N", "KeyN")] },
                    { text: "മല", sequence: [press("C", "KeyC"), press("N", "KeyN")] },
                ],
            },
            {
                id: "lesson-4-speed",
                type: "speed",
                title: "Improve Speed",
                subtitle: "Short word drill",
                preview: "കല മല മാല",
                duration: 46,
                requiredWpm: 12,
                requiredAccuracy: 88,
                nextLine: "കല മല മാല മല",
                units: [
                    { text: "കല", sequence: [press("K", "KeyK"), press("N", "KeyN")] },
                    { text: "മല", sequence: [press("C", "KeyC"), press("N", "KeyN")] },
                    {
                        text: "മാല",
                        sequence: [
                            press("C", "KeyC"),
                            press("E", "KeyE"),
                            press("N", "KeyN"),
                        ],
                    },
                ],
            },
        ],
    ),
    lesson(
        5,
        "simple-words-2",
        "വാക്കുകൾ",
        "ന ര സ",
        "Add common flowing letters that appear in many Malayalam words.",
        "നരം രസം",
        ["V", "J", "M"],
        [
            {
                id: "lesson-5-learn",
                type: "learn",
                title: "Learn ന ര സ",
                subtitle: "Flow set",
                preview: "ന ര സ",
                duration: 40,
                requiredWpm: 9,
                requiredAccuracy: 85,
                nextLine: "ന ര സ നരം രസം",
                units: [
                    { text: "ന", sequence: [press("V", "KeyV")] },
                    { text: "ര", sequence: [press("J", "KeyJ")] },
                    { text: "സ", sequence: [press("M", "KeyM")] },
                    {
                        text: "നരം",
                        sequence: [
                            press("V", "KeyV"),
                            press("J", "KeyJ"),
                            press("X", "KeyX"),
                        ],
                    },
                    {
                        text: "രസം",
                        sequence: [
                            press("J", "KeyJ"),
                            press("M", "KeyM"),
                            press("X", "KeyX"),
                        ],
                    },
                ],
            },
            {
                id: "lesson-5-speed",
                type: "speed",
                title: "Improve Speed",
                subtitle: "Flow drill",
                preview: "രസം നരം",
                duration: 48,
                requiredWpm: 13,
                requiredAccuracy: 88,
                nextLine: "രസം നരം സരം",
                units: [
                    {
                        text: "രസം",
                        sequence: [
                            press("J", "KeyJ"),
                            press("M", "KeyM"),
                            press("X", "KeyX"),
                        ],
                    },
                    {
                        text: "നരം",
                        sequence: [
                            press("V", "KeyV"),
                            press("J", "KeyJ"),
                            press("X", "KeyX"),
                        ],
                    },
                ],
            },
        ],
    ),
    lesson(
        6,
        "keralam",
        "വാക്കുകൾ",
        "കേരളം",
        "Practice a longer Malayalam word with mixed rows and signs.",
        "കേരളം",
        ["K", "S", "J", "N", "X"],
        [
            {
                id: "lesson-6-learn",
                type: "learn",
                title: "Learn കേരളം",
                subtitle: "Long word focus",
                preview: "കേരളം",
                duration: 48,
                requiredWpm: 10,
                requiredAccuracy: 85,
                nextLine: "കേരളം നല്ല കേരളം",
                units: [
                    {
                        text: "കേരളം",
                        sequence: [
                            press("K", "KeyK"),
                            press("S", "KeyS"),
                            press("J", "KeyJ"),
                            press("N", "KeyN", true),
                            press("X", "KeyX"),
                        ],
                    },
                    {
                        text: "നല്ല",
                        sequence: [
                            press("V", "KeyV"),
                            press("N", "KeyN"),
                            press("D", "KeyD"),
                            press("N", "KeyN"),
                        ],
                    },
                ],
            },
            {
                id: "lesson-6-speed",
                type: "speed",
                title: "Improve Speed",
                subtitle: "Long word drill",
                preview: "കേരളം",
                duration: 56,
                requiredWpm: 14,
                requiredAccuracy: 88,
                nextLine: "കേരളം നല്ല കേരളം",
                units: [
                    {
                        text: "കേരളം",
                        sequence: [
                            press("K", "KeyK"),
                            press("S", "KeyS"),
                            press("J", "KeyJ"),
                            press("N", "KeyN", true),
                            press("X", "KeyX"),
                        ],
                    },
                    {
                        text: "കേരളം",
                        sequence: [
                            press("K", "KeyK"),
                            press("S", "KeyS"),
                            press("J", "KeyJ"),
                            press("N", "KeyN", true),
                            press("X", "KeyX"),
                        ],
                    },
                ],
            },
        ],
    ),
    lesson(
        7,
        "malayalam",
        "പ്രാക്ടീസ്",
        "മലയാളം",
        "Train the core word of the whole product with full confidence.",
        "മലയാളം",
        ["C", "N", "Y", "E", "N", "X"],
        [
            {
                id: "lesson-7-learn",
                type: "learn",
                title: "Learn മലയാളം",
                subtitle: "Core word",
                preview: "മലയാളം",
                duration: 50,
                requiredWpm: 11,
                requiredAccuracy: 85,
                nextLine: "മലയാളം മാല മലയാളം",
                units: [
                    {
                        text: "മലയാളം",
                        sequence: [
                            press("C", "KeyC"),
                            press("N", "KeyN"),
                            press("Y", "KeyY"),
                            press("E", "KeyE"),
                            press("N", "KeyN", true),
                            press("X", "KeyX"),
                        ],
                    },
                    {
                        text: "മാല",
                        sequence: [
                            press("C", "KeyC"),
                            press("E", "KeyE"),
                            press("N", "KeyN"),
                        ],
                    },
                ],
            },
            {
                id: "lesson-7-speed",
                type: "speed",
                title: "Improve Speed",
                subtitle: "Word repetition",
                preview: "മലയാളം",
                duration: 58,
                requiredWpm: 15,
                requiredAccuracy: 90,
                nextLine: "മലയാളം മലയാളം മാല",
                units: [
                    {
                        text: "മലയാളം",
                        sequence: [
                            press("C", "KeyC"),
                            press("N", "KeyN"),
                            press("Y", "KeyY"),
                            press("E", "KeyE"),
                            press("N", "KeyN", true),
                            press("X", "KeyX"),
                        ],
                    },
                    {
                        text: "മലയാളം",
                        sequence: [
                            press("C", "KeyC"),
                            press("N", "KeyN"),
                            press("Y", "KeyY"),
                            press("E", "KeyE"),
                            press("N", "KeyN", true),
                            press("X", "KeyX"),
                        ],
                    },
                ],
            },
        ],
    ),
    lesson(
        8,
        "abhyasam",
        "പ്രാക്ടീസ്",
        "അഭ്യാസം",
        "Finish the starter course with a final production-style practice lesson.",
        "അഭ്യാസം",
        ["Shift + D", "Shift + Y", "D", "Y", "E", "M", "X"],
        [
            {
                id: "lesson-8-learn",
                type: "learn",
                title: "Learn അഭ്യാസം",
                subtitle: "Final guided lesson",
                preview: "അഭ്യാസം",
                duration: 55,
                requiredWpm: 12,
                requiredAccuracy: 85,
                nextLine: "അഭ്യാസം മലയാളം കേരളം",
                units: [
                    {
                        text: "അഭ്യാസം",
                        sequence: [
                            press("D", "KeyD", true),
                            press("Y", "KeyY", true),
                            press("D", "KeyD"),
                            press("Y", "KeyY"),
                            press("E", "KeyE"),
                            press("M", "KeyM"),
                            press("X", "KeyX"),
                        ],
                    },
                    {
                        text: "മലയാളം",
                        sequence: [
                            press("C", "KeyC"),
                            press("N", "KeyN"),
                            press("Y", "KeyY"),
                            press("E", "KeyE"),
                            press("N", "KeyN", true),
                            press("X", "KeyX"),
                        ],
                    },
                ],
            },
            {
                id: "lesson-8-speed",
                type: "speed",
                title: "Final Speed Check",
                subtitle: "Pass to finish this base course",
                preview: "അഭ്യാസം മലയാളം",
                duration: 65,
                requiredWpm: 18,
                requiredAccuracy: 90,
                nextLine: "അഭ്യാസം മലയാളം കേരളം",
                units: [
                    {
                        text: "അഭ്യാസം",
                        sequence: [
                            press("D", "KeyD", true),
                            press("Y", "KeyY", true),
                            press("D", "KeyD"),
                            press("Y", "KeyY"),
                            press("E", "KeyE"),
                            press("M", "KeyM"),
                            press("X", "KeyX"),
                        ],
                    },
                    {
                        text: "മലയാളം",
                        sequence: [
                            press("C", "KeyC"),
                            press("N", "KeyN"),
                            press("Y", "KeyY"),
                            press("E", "KeyE"),
                            press("N", "KeyN", true),
                            press("X", "KeyX"),
                        ],
                    },
                    {
                        text: "കേരളം",
                        sequence: [
                            press("K", "KeyK"),
                            press("S", "KeyS"),
                            press("J", "KeyJ"),
                            press("N", "KeyN", true),
                            press("X", "KeyX"),
                        ],
                    },
                ],
            },
        ],
    ),
];
