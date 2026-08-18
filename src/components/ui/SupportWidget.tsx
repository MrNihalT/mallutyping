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
                className="fixed bottom-5 right-5 z-[9999] flex items-center justify-center rounded-full border border-[#db2777]/20 bg-pink-50/90 p-3 shadow-[0_8px_24px_rgba(219,39,119,0.15)] hover:bg-pink-100/90 active:scale-95 transition-all cursor-pointer"
                title="Support"
                aria-label="Support"
            >
                <IconHeart size={20} className="fill-red-500 text-red-500" />
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
                    {/* Modal Content Box */}
                    <div className="relative max-w-lg w-full rounded-[2rem] border border-slate-900/10 bg-white/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-scale-in">
                        
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="absolute right-4 top-4 rounded-full border border-slate-900/10 bg-white/80 p-1.5 text-slate-900 shadow-sm hover:bg-white active:scale-95 transition-all cursor-pointer"
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
                                className="flex flex-col items-center rounded-2xl border border-slate-900/10 bg-white/60 p-4 shadow-sm hover:bg-white transition-all cursor-pointer group animate-pop-in-card-1"
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
                            <div className="flex flex-col items-center rounded-2xl border border-slate-900/10 bg-white/60 p-4 shadow-sm animate-pop-in-card-2">
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
                                className="rounded-full border border-slate-900/10 bg-yellow-300/80 px-6 py-2.5 text-sm font-black text-black shadow-sm hover:bg-yellow-300 active:scale-95 transition-all cursor-pointer"
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
