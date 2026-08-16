import type { Metadata } from "next";
import PublicHeader from "@/components/layout/PublicHeader";
import PracticeArea from "@/components/typing/PracticeArea";

export const metadata: Metadata = {
    title: "Malayalam Typing Practice - Monkeytype Mode | MalluTyping",
    description:
        "Practice Malayalam typing online with a 30-second speed challenge. Type custom Malayalam words, test your speed and accuracy in real-time, and master the Inscript layout.",
    keywords: [
        "malayalam typing practice",
        "malayalam typing speed test",
        "malayalam monkeytype",
        "learn malayalam typing online",
        "inscript keyboard practice",
        "മലയാളം ടൈപ്പിംഗ്"
    ],
};

export default function PracticePage() {
    return (
        <div className="sky-wash paper-grid min-h-screen p-4">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
                <PublicHeader />
                <PracticeArea />
            </div>
        </div>
    );
}
