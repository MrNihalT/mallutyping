"use client";

import { useState } from "react";
import Image from "next/image";
import { IconHeart, IconX, IconCopy, IconCheck } from "@tabler/icons-react";
import buyMeCoffeeQr from "@/assets/support/1.svg";
import upiQr from "@/assets/support/2.svg";

export default function SupportWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Support Button (Bottom Right) */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 right-5 z-40 flex items-center justify-center rounded-full border-2 border-black bg-[#c084fc] p-3 shadow-[3px_3px_0px_black] hover:bg-[#b070ec] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                title="Support"
                aria-label="Support"
            >
                <IconHeart size={20} className="fill-red-500 text-red-500" />
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    {/* Modal Content Box */}
                    <div className="relative max-w-lg w-full rounded-[2rem] border-[3px] border-black bg-[#eaf9fc] p-6 shadow-[8px_8px_0px_black]">
                        
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="absolute right-4 top-4 rounded-full border-2 border-black bg-white p-1.5 text-slate-900 shadow-[1.5px_1.5px_0px_black] hover:bg-slate-100 active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                        >
                            <IconX size={18} />
                        </button>

                        <div className="text-center">
                            <h3 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
                                <IconHeart className="fill-red-500 text-red-500" />
                                Support MalluTyping
                            </h3>
                            <p className="mt-2 text-sm font-semibold text-slate-600">
                                If you find this Malayalam typing tool helpful, consider supporting me! Any amount is greatly appreciated. ❤️
                            </p>
                        </div>

                        {/* QRs Container */}
                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Buy Me a Coffee QR */}
                            <a
                                href="https://buymeacoffee.com/nihalt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center rounded-2xl border-2 border-black bg-white p-4 shadow-[3px_3px_0px_black] hover:bg-slate-50 transition-all cursor-pointer group"
                            >
                                <span className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 group-hover:text-amber-500 transition-colors">
                                    Buy Me a Coffee
                                </span>
                                <div className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-lg border border-slate-200">
                                    <Image
                                        src={buyMeCoffeeQr}
                                        alt="Buy Me a Coffee QR Code"
                                        fill
                                        sizes="160px"
                                        className="object-contain"
                                    />
                                </div>
                                <span className="mt-2 text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                                    Click to visit profile ☕
                                </span>
                            </a>

                            {/* UPI / GPay QR */}
                            <div className="flex flex-col items-center rounded-2xl border-2 border-black bg-white p-4 shadow-[3px_3px_0px_black]">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                                    GPay / UPI Payment
                                </span>
                                <div className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-lg border border-slate-200">
                                    <Image
                                        src={upiQr}
                                        alt="UPI / GPay QR Code"
                                        fill
                                        sizes="160px"
                                        className="object-contain"
                                    />
                                </div>
                                
                                {/* UPI ID display & copy button */}
                                <div className="mt-3 flex w-full flex-col items-center gap-1">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                        UPI ID
                                    </span>
                                    <div className="flex items-center gap-1 w-full max-w-[160px] rounded-lg border border-slate-200 bg-slate-50 p-1.5">
                                        <span className="flex-1 truncate text-center text-xs font-bold text-slate-700 select-all">
                                            nihal.chiyoor@oksbi
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy("nihal.chiyoor@oksbi")}
                                            className="rounded p-1 hover:bg-slate-200 active:bg-slate-300 transition-colors text-slate-600 flex items-center justify-center cursor-pointer"
                                            title="Copy UPI ID"
                                        >
                                            {copied ? (
                                                <IconCheck size={14} className="text-green-600" />
                                            ) : (
                                                <IconCopy size={14} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full border-2 border-black bg-[#c084fc] px-6 py-2 text-sm font-black text-black shadow-[2px_2px_0px_black] hover:bg-[#b070ec] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
