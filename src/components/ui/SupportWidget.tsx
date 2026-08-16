"use client";

import { useState } from "react";
import Image from "next/image";
import { IconHeart, IconX } from "@tabler/icons-react";
import buyMeCoffeeQr from "@/assets/support/1.svg";
import upiQr from "@/assets/support/2.svg";

export default function SupportWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Support Button (Bottom Right) */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border-2 border-black bg-[#c084fc] px-4 py-2.5 text-sm font-black text-black shadow-[3px_3px_0px_black] hover:bg-[#b070ec] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
                <IconHeart size={16} className="fill-red-500 text-red-500" />
                <span>Support</span>
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
                            <div className="flex flex-col items-center rounded-2xl border-2 border-black bg-white p-4 shadow-[3px_3px_0px_black]">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
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
                            </div>

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
