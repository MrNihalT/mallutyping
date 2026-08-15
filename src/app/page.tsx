import PublicHeader from "@/components/layout/PublicHeader";
import LearningExperience from "@/components/typing/LearningExperience";

export default function HomePage() {
    return (
        <div className="sky-wash paper-grid min-h-screen p-4">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
                <PublicHeader />
                <LearningExperience />
            </div>
        </div>
    );
}
