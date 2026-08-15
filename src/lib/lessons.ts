import lessonData from "@/data/malayalam-lessons.json";

export type MalayalamLesson = {
    id: string;
    slug: string;
    title: string;
    level: "beginner" | "intermediate" | "advanced";
    description: string;
    goal: string;
    focusKeys: string[];
    estimatedMinutes: number;
    words: string[];
    sentences: string[];
};

export function getMalayalamLessons(): MalayalamLesson[] {
    return lessonData as MalayalamLesson[];
}
