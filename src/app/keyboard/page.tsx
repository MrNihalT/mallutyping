import type { Metadata } from "next";
import PublicHeader from "@/components/layout/PublicHeader";
import KeyboardReference from "@/components/typing/KeyboardReference";

export const metadata: Metadata = {
    title: "Malayalam Keyboard Layout & Key Map Reference | MalluTyping",
    description:
        "Learn and practice Malayalam typing online. View the Malayalam character mapping on the standard inscript keyboard layout with our interactive reference.",
    keywords: [
        "malayalam keyboard",
        "malayalam keyboard layout",
        "malayalam key map",
        "malayalam inscript keyboard",
        "malayalam characters keyboard",
        "learn malayalam keyboard layout",
        "മലയാളം കീബോർഡ് ലേഔട്ട്"
    ],
};

export default function KeyboardPage() {
    return (
        <div className="sky-wash paper-grid min-h-screen p-4">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
                <PublicHeader />
                <section className="rounded-[2.4rem] border-[3px] border-black bg-white/90 p-6 shadow-[8px_8px_0px_black]">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                        Keyboard Reference
                    </p>
                    <h2 className="mt-2 text-4xl font-black text-slate-900">
                        Malayalam key map
                    </h2>
                    <p className="mt-3 text-base font-medium text-slate-600">
                        This page shows the Malayalam letters and the English keyboard positions
                        used inside the trainer.
                    </p>
                </section>
                <KeyboardReference />
            </div>
        </div>
    );
}
