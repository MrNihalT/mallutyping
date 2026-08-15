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
        <div className="sky-wash paper-grid h-screen overflow-hidden p-4 flex flex-col">
            <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-3 h-full min-h-0">
                <PublicHeader />
                <LessonPlayer lessonId={parsedLessonId} />
            </div>
        </div>
    );
}
