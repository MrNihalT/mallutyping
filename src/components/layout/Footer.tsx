export default function Footer() {
    return (
        <footer className="relative z-10 mx-auto mt-10 max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-3 rounded-[2rem] border-[3px] border-black bg-white/85 px-6 py-5 text-center shadow-[6px_6px_0px_black] backdrop-blur md:flex-row md:text-left">
                <div>
                    <p className="text-lg font-black text-slate-900">
                        MalluTyping
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                        Malayalam typing lessons, speed practice, and progress-ready data.
                    </p>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                    Built for learners who want clean structure, strong visuals, and proper Malayalam practice content.
                </p>
            </div>
        </footer>
    );
}
