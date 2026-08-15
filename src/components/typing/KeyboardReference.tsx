import { keyboardReferenceGroups, keyboardRows } from "@/lib/keyboard/malayalam";

export default function KeyboardReference({ compact = false }: { compact?: boolean }) {
    return (
        <div className="space-y-6">
            <section className="rounded-[2rem] border-[3px] border-black bg-white/88 p-4 shadow-[6px_6px_0px_black] sm:p-5">
                <div className="overflow-hidden rounded-[1.75rem] border-[3px] border-black bg-[#596163] p-3">
                    <div className="space-y-2 rounded-[1.3rem] bg-[#6b7375] p-2">
                        {keyboardRows.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className="grid grid-cols-12 gap-2"
                            >
                                {row.map((item) => {
                                    const spanClass =
                                        item.width === "space"
                                            ? "col-span-6"
                                            : item.width === "wide"
                                              ? "col-span-2"
                                              : "col-span-1";
                                    const baseTone =
                                        item.tone === "accent"
                                            ? "bg-[#a6f113]"
                                            : item.tone === "mint"
                                              ? "bg-[#8ce7ac]"
                                              : "bg-white";

                                    return (
                                        <div
                                            key={`${rowIndex}-${item.code}`}
                                            className={`${spanClass} ${baseTone} flex h-12 flex-col items-center justify-center rounded-2xl border border-[#b5f2d1] px-2 text-center shadow-[0_4px_0_rgba(107,202,153,0.6)] sm:h-14`}
                                        >
                                            {item.normal ? (
                                                <div className="font-malayalam flex h-full w-full flex-col items-center justify-between py-1 text-slate-700">
                                                    <span className="text-[11px] leading-none">
                                                        {item.label}
                                                    </span>
                                                    <span className="text-[14px] font-semibold leading-none sm:text-[15px]">
                                                        {item.normal}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-semibold text-slate-800">
                                                    {item.label}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={`grid gap-4 ${compact ? "md:grid-cols-2" : "lg:grid-cols-3"}`}>
                {keyboardReferenceGroups.map((group) => (
                    <div
                        key={group.title}
                        className="rounded-[1.8rem] border-[3px] border-black bg-white/92 p-4 shadow-[5px_5px_0px_black]"
                    >
                        <h3 className="text-lg font-black text-slate-900">{group.title}</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {group.items.map((item) => (
                                <span
                                    key={`${group.title}-${item}`}
                                    className="font-malayalam rounded-full border-2 border-black bg-[#eaf9fc] px-3 py-2 text-lg font-semibold text-slate-800"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
