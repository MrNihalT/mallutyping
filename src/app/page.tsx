import PublicHeader from "@/components/layout/PublicHeader";
import LearningExperience from "@/components/typing/LearningExperience";
import { Analytics } from "@vercel/analytics/next"
export default function HomePage() {
    return (
        <div className="sky-wash paper-grid min-h-screen p-4">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
                <PublicHeader />
                <LearningExperience />
                <Analytics />
            </div>
        </div>
    );
}
