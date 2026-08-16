import { keyboardReferenceGroups, keyboardRows } from "@/lib/keyboard/malayalam";

export default function KeyboardReference({ compact = false }: { compact?: boolean }) {
    return (
        <div className="space-y-6">
            <section className="rounded-[2rem] border-[3px] border-black bg-white/88 p-4 shadow-[6px_6px_0px_black] sm:p-5">
                <div className="overflow-hidden rounded-[1.8rem] border-[4px] border-[#1e222b] bg-[#1e222b] p-2.5 w-full max-w-[820px] mx-auto shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                    <div className="space-y-1.5 rounded-[1.2rem] bg-[#2d323f] p-2 w-full flex flex-col border-[2px] border-[#282d39]">
                        {keyboardRows.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-1 w-full justify-between">
                                {row.map((item) => {
                                    const flexStyle =
                                        item.code === "Space"
                                            ? { flex: "6.25 6.25 0%" }
                                            : item.code === "Backspace"
                                              ? { flex: "2 2 0%" }
                                              : item.code === "ShiftLeft" || item.code === "ShiftRight"
                                                ? { flex: "2.25 2.25 0%" }
                                                : item.code === "CapsLock"
                                                  ? { flex: "1.75 1.75 0%" }
                                                  : item.code === "Tab"
                                                    ? { flex: "1.5 1.5 0%" }
                                                    : item.tone === "mint"
                                                      ? { flex: "1.25 1.25 0%" }
                                                      : { flex: "1 1 0%" };

                                    const baseTone =
                                        item.tone === "accent"
                                            ? "bg-[#c084fc] text-black border-[#a855f7] border-b-[#8b5cf6]"
                                            : item.tone === "mint"
                                              ? "bg-[#78db9e] text-slate-800 border-[#5cb882] border-b-[#48976b]"
                                              : "bg-white text-slate-700 border-slate-200 border-b-slate-300";

                                    return (
                                        <div
                                            key={`${rowIndex}-${item.code}`}
                                            style={flexStyle}
                                            className={`h-11 md:h-12 flex flex-col items-center justify-center rounded-[8px] border-[2px] px-1 font-bold text-center border-b-[5px] select-none ${baseTone}`}
                                        >
                                            {item.normal ? (
                                                <div className="font-malayalam flex h-full w-full flex-col items-center justify-between py-0.5">
                                                    <span className="text-[10px] md:text-[11px] leading-none opacity-60">
                                                        {item.label}
                                                    </span>
                                                    <span className="text-[13px] font-extrabold leading-none md:text-[14px]">
                                                        {item.normal}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.05em]">
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
