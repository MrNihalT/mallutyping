import { Metadata } from "next";
import { trainerLessons } from "@/lib/trainer-lessons";
import PublicHeader from "@/components/layout/PublicHeader";
import LessonPlayer from "@/components/typing/LessonPlayer";

type LessonPageProps = {
    params: Promise<{
        lessonId: string;
    }>;
};

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
    const { lessonId } = await params;
    const parsedLessonId = Number(lessonId);
    const lesson = trainerLessons.find((l) => l.id === parsedLessonId);

    if (!lesson) {
        return {
            title: "Malayalam Typing Lesson | MalluTyping",
            description: "Practice Malayalam typing online with structured lessons.",
        };
    }

    return {
        title: `Lesson ${lesson.id}: ${lesson.title} - Malayalam Typing Practice | MalluTyping`,
        description: `Learn and practice typing '${lesson.preview}' in Malayalam. ${lesson.summary} Improve your typing speed and accuracy.`,
        keywords: [
            `learn malayalam typing lesson ${lesson.id}`,
            "malayalam typing practice",
            "malayalam typing lessons",
            `malayalam typing ${lesson.title}`,
            "malayalam keyboard practice",
            "malayalam speed test"
        ]
    };
}

export default async function LessonPage({ params }: LessonPageProps) {
    const { lessonId } = await params;
    const parsedLessonId = Number(lessonId);

    return (
        <div className="sky-wash paper-grid h-screen overflow-hidden p-4 flex flex-col page-transition">
            <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-3 h-full min-h-0">
                <PublicHeader />
                <LessonPlayer lessonId={parsedLessonId} />
            </div>
        </div>
    );
}
