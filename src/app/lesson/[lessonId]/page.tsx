import PublicHeader from "@/components/layout/PublicHeader";
import LessonPlayer from "@/components/typing/LessonPlayer";

type LessonPageProps = {
    params: Promise<{
        lessonId: string;
    }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
    const { lessonId } = await params;
    const parsedLessonId = Number(lessonId);

    return (
        <div className="sky-wash paper-grid min-h-screen p-4">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
                <PublicHeader />
                <LessonPlayer lessonId={parsedLessonId} />
            </div>
        </div>
    );
}
