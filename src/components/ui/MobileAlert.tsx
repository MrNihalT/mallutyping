"use client";

import { useEffect, useState } from "react";
import { IconDeviceLaptop, IconX } from "@tabler/icons-react";

export default function MobileAlert() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const isMobileWidth = window.innerWidth < 768;
            const isDismissed = localStorage.getItem("mallutyping_mobile_dismissed") === "true";
            
            if (isMobileWidth && !isDismissed) {
                setIsOpen(true);
            }
        };

        const timer = setTimeout(checkMobile, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        localStorage.setItem("mallutyping_mobile_dismissed", "true");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-sm rounded-[2rem] border-[3px] border-black bg-white p-6 text-center shadow-[8px_8px_0px_black] animate-scale-in">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="absolute right-4 top-4 rounded-full border-2 border-black bg-white p-1 text-black shadow-[2px_2px_0px_black] hover:bg-slate-100 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    aria-label="Close"
                >
                    <IconX size={16} stroke={2.5} />
                </button>

                {/* Icon Section */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-black bg-[#b3f023] shadow-[3px_3px_0px_black] mb-4">
                    <IconDeviceLaptop size={32} stroke={2.5} className="text-black" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    Desktop Optimized
                </h3>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mt-1">
                    ഡെസ്ക്ടോപ്പ് അനുയോജ്യം
                </p>

                {/* Description */}
                <p className="mt-4 text-sm font-semibold text-slate-600 leading-relaxed">
                    MalluTyping is optimized for <strong>physical keyboards</strong> and desktop screens to build muscle memory. The experience on mobile touchscreens is limited.
                </p>
                <p className="mt-2 text-xs font-semibold text-slate-500 font-malayalam leading-relaxed">
                    മലയാളം ടൈപ്പിംഗ് പരിശീലനത്തിനായി കമ്പ്യൂട്ടറും ഫിസിക്കൽ കീബോർഡും ഉപയോഗിക്കുക.
                </p>

                {/* Action Button */}
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="w-full rounded-full border-[3px] border-black bg-[#c084fc] py-3 text-sm font-black text-black shadow-[3px_3px_0px_black] hover:bg-[#b070ec] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                        Continue Anyway / തുടരുക
                    </button>
                </div>
            </div>
        </div>
    );
}
