"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    IconKeyboard,
    IconLogin2,
    IconLogout2,
    IconUserPlus,
    IconBrandInstagram,
    IconBrandTwitter,
    IconGlobe,
    IconBarbell,
    IconMenu2,
    IconX,
} from "@tabler/icons-react";

type NavbarUser = {
    email: string;
    fullName: string;
    username: string;
};

export default function Navbar({ user }: { user: NavbarUser | null }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement | null>(null);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
            if (
                drawerRef.current &&
                !drawerRef.current.contains(event.target as Node) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, [isMenuOpen]);

    return (
        <>
            <header className="sticky top-4 z-30 mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-slate-900/10 iphone-glass px-6 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:px-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="rounded-full border border-purple-500/30 bg-[#c084fc]/85 w-12 h-12 font-bold shadow-sm text-black flex items-center justify-center font-malayalam text-2xl md:text-3xl leading-none select-none">
                        മ
                    </div>

                    <h1 className="text-2xl font-black sm:text-3xl">
                        Mallu<span className="text-gray-400">Typing</span>
                    </h1>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-2">
                    <Link
                        href="/practice"
                        className="flex items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-300/60 p-2.5 text-slate-900 shadow-sm hover:bg-yellow-300 active:scale-95 transition-all cursor-pointer"
                        title="Practice"
                    >
                        <IconBarbell size={18} />
                    </Link>

                    <Link
                        href="/keyboard"
                        className="flex items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-200/40 p-2.5 text-slate-900 shadow-sm hover:bg-cyan-200/60 active:scale-95 transition-all cursor-pointer"
                        title="Keyboard Layout Reference"
                    >
                        <IconKeyboard size={18} />
                    </Link>

                    {/* Social Links */}
                    <a
                        href="https://nihalt.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-full border border-slate-900/10 bg-white/60 p-2.5 text-slate-800 shadow-sm hover:bg-white active:scale-95 transition-all cursor-pointer"
                        title="nihalt.in"
                    >
                        <IconGlobe size={18} />
                    </a>

                    <a
                        href="https://instagram.com/_nihaal_t"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-full border border-[#db2777]/20 bg-pink-50/60 p-2.5 text-[#db2777] shadow-sm hover:bg-pink-100/80 active:scale-95 transition-all cursor-pointer"
                        title="Instagram"
                    >
                        <IconBrandInstagram size={18} />
                    </a>

                    <a
                        href="https://x.com/_nihaal_t"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-full border border-slate-900/20 bg-slate-900/10 p-2.5 text-white shadow-sm hover:bg-slate-900/20 active:scale-95 transition-all cursor-pointer"
                        title="Twitter / X"
                    >
                        <IconBrandTwitter size={18} />
                    </a>

                    {user ? (
                        <a
                            href="/auth/logout"
                            className="flex items-center justify-center rounded-full border border-slate-900/10 bg-white/60 p-2.5 text-slate-900 shadow-sm hover:bg-white active:scale-95 transition-all cursor-pointer"
                            title="Logout"
                        >
                            <IconLogout2 size={18} />
                        </a>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="flex items-center justify-center rounded-full border border-slate-900/10 bg-white/60 p-2.5 text-slate-900 shadow-sm hover:bg-white active:scale-95 transition-all cursor-pointer"
                                title="Login"
                            >
                                <IconLogin2 size={18} />
                            </Link>

                            <Link
                                href="/register"
                                className="flex items-center justify-center rounded-full border border-[#c084fc]/30 bg-[#c084fc]/50 p-2.5 text-slate-900 shadow-sm hover:bg-[#c084fc]/70 active:scale-95 transition-all cursor-pointer"
                                title="Register"
                            >
                                <IconUserPlus size={18} />
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Navigation Controls */}
                <div className="flex lg:hidden items-center gap-2">
                    <Link
                        href="/practice"
                        className="flex items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-300/60 p-2.5 text-slate-900 shadow-sm hover:bg-yellow-300 active:scale-95 transition-all cursor-pointer"
                        title="Practice"
                    >
                        <IconBarbell size={18} />
                    </Link>

                    <button
                        ref={menuButtonRef}
                        type="button"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="flex items-center justify-center rounded-full border border-slate-900/10 bg-white/60 p-2.5 text-slate-800 shadow-sm hover:bg-white active:scale-95 transition-all cursor-pointer"
                        aria-label="Open Menu"
                    >
                        <IconMenu2 size={18} />
                    </button>
                </div>
            </header>

            {/* Mobile Drawer Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 ease-in-out lg:hidden ${
                    isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Side Drawer Panel */}
            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 h-full w-[280px] bg-white border-l-[3px] border-black shadow-[-8px_0px_0px_black] z-50 p-6 flex flex-col justify-between transition-all duration-300 ease-in-out lg:hidden ${
                    isMenuOpen ? "translate-x-0 visible opacity-100" : "translate-x-full invisible opacity-0 pointer-events-none"
                }`}
            >
                <div>
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between border-b-2 border-black/10 pb-4">
                        <div className="flex items-center gap-2">
                            <div className="rounded-[6px] border-2 border-black bg-[#c084fc] px-2 py-0.5 font-bold shadow-[1.5px_1.5px_0px_black] text-black font-malayalam text-sm">
                                മ
                            </div>
                            <span className="font-black text-slate-900 text-sm">MalluTyping</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-full border-2 border-black bg-slate-100 p-1 text-slate-800 shadow-[1.5px_1.5px_0px_black] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                            aria-label="Close Menu"
                        >
                            <IconX size={14} />
                        </button>
                    </div>

                    {/* Drawer Links */}
                    <div className="flex flex-col gap-4 py-8">
                        <Link
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 rounded-[10px] border-2 border-black bg-white px-4 py-2.5 text-xs font-black shadow-[2px_2px_0px_black] active:translate-y-0.5 active:shadow-none transition-all text-slate-800"
                        >
                            Home
                        </Link>

                        <Link
                            href="/practice"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 rounded-[10px] border-2 border-black bg-[#fef08a] px-4 py-2.5 text-xs font-black shadow-[2px_2px_0px_black] active:translate-y-0.5 active:shadow-none transition-all text-slate-900"
                        >
                            Practice
                        </Link>

                        <Link
                            href="/keyboard"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 rounded-[10px] border-2 border-black bg-[#eaf9fc] px-4 py-2.5 text-xs font-black shadow-[2px_2px_0px_black] active:translate-y-0.5 active:shadow-none transition-all text-slate-900"
                        >
                            Keyboard Layout
                        </Link>

                        {user ? (
                            <a
                                href="/auth/logout"
                                className="flex items-center gap-2 rounded-[10px] border-2 border-black bg-red-50 text-red-600 px-4 py-2.5 text-xs font-black shadow-[2px_2px_0px_black]"
                            >
                                <IconLogout2 size={14} />
                                Logout
                            </a>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 rounded-[10px] border-2 border-black bg-white px-4 py-2.5 text-xs font-black shadow-[2px_2px_0px_black] text-slate-900"
                                >
                                    <IconLogin2 size={14} />
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 rounded-[10px] border-2 border-black bg-[#c084fc] px-4 py-2.5 text-xs font-black shadow-[2px_2px_0px_black] text-slate-900"
                                >
                                    <IconUserPlus size={14} />
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Drawer Footer socials */}
                <div className="flex flex-col gap-3 border-t-2 border-black/10 pt-4">
                    <a
                        href="https://nihalt.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1.5 text-[10px] font-black shadow-[1.5px_1.5px_0px_black] text-slate-800"
                    >
                        <IconGlobe size={12} />
                        <span>nihalt.in</span>
                    </a>

                    <div className="flex gap-2">
                        <a
                            href="https://instagram.com/_nihaal_t"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1 rounded-full border-2 border-black bg-[#fdf2f8] py-1.5 text-[10px] font-black text-[#db2777] shadow-[1.5px_1.5px_0px_black]"
                        >
                            <IconBrandInstagram size={12} />
                            <span>Instagram</span>
                        </a>

                        <a
                            href="https://x.com/_nihaal_t"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1 rounded-full border-2 border-black bg-slate-900 py-1.5 text-[10px] font-black text-white shadow-[1.5px_1.5px_0px_black]"
                        >
                            <IconBrandTwitter size={12} />
                            <span>Twitter / X</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
