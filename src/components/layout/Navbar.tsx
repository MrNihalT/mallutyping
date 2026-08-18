"use client";

import { useState } from "react";
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

    return (
        <>
            <header className="sticky top-4 z-30 mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[2rem] border-[3px] border-black iphone-glass px-5 py-4 shadow-[6px_6px_0px_black] sm:px-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="rounded-[10px] border-2 border-black bg-[#c084fc] px-3.5 py-1.5 font-bold shadow-[2.5px_2.5px_0px_black] text-black flex items-center justify-center font-malayalam text-2xl md:text-3xl leading-none select-none">
                        മ
                    </div>

                    <h1 className="text-2xl font-black sm:text-3xl">
                        Mallu<span className="text-gray-400">Typing</span>
                    </h1>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-4">
                    <div className="flex gap-2">
                        <Link
                            href="/practice"
                            data-chip="true"
                            className="rounded-full border-2 border-black bg-[#fef08a] px-4 py-2 text-sm font-bold shadow-[3px_3px_0px_black] hover:bg-yellow-200 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <IconBarbell size={16} />
                                Practice
                            </span>
                        </Link>

                        <Link
                            href="/keyboard"
                            data-chip="true"
                            className="rounded-full border-2 border-black bg-[#eaf9fc] px-4 py-2 text-sm font-bold shadow-[3px_3px_0px_black] hover:bg-cyan-100 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <IconKeyboard size={16} />
                                Keyboard
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Social Links */}
                        <a
                            href="https://nihalt.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_black] hover:bg-slate-50 active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer text-slate-800"
                        >
                            <IconGlobe size={14} />
                            <span>nihalt.in</span>
                        </a>

                        <a
                            href="https://instagram.com/_nihaal_t"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center rounded-full border-2 border-black bg-[#fdf2f8] p-2 text-[#db2777] shadow-[2px_2px_0px_black] hover:bg-pink-100 active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                            title="Instagram"
                        >
                            <IconBrandInstagram size={16} />
                        </a>

                        <a
                            href="https://x.com/_nihaal_t"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center rounded-full border-2 border-black bg-slate-900 p-2 text-white shadow-[2px_2px_0px_black] hover:bg-slate-800 active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                            title="Twitter / X"
                        >
                            <IconBrandTwitter size={16} />
                        </a>

                        {user ? (
                            <a
                                href="/auth/logout"
                                className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-5 py-3 shadow-[3px_3px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none text-sm font-bold"
                            >
                                <IconLogout2 size={20} />
                                Logout
                            </a>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-5 py-3 shadow-[3px_3px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none text-sm font-bold"
                                >
                                    <IconLogin2 size={20} />
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    className="flex items-center gap-2 rounded-full border-2 border-black bg-[#c084fc] px-5 py-3 shadow-[3px_3px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none text-sm font-bold"
                                >
                                    <IconUserPlus size={20} />
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Controls */}
                <div className="flex lg:hidden items-center gap-2">
                    <Link
                        href="/practice"
                        className="rounded-full border-2 border-black bg-[#fef08a] px-3.5 py-1.5 text-xs font-bold shadow-[2px_2px_0px_black] hover:bg-yellow-200 transition-colors"
                    >
                        Practice
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(true)}
                        className="rounded-full border-2 border-black bg-white p-2 text-slate-800 shadow-[1.5px_1.5px_0px_black] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        aria-label="Open Menu"
                    >
                        <IconMenu2 size={16} />
                    </button>
                </div>
            </header>

            {/* Mobile Drawer Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Mobile Side Drawer Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] bg-white border-l-[3px] border-black shadow-[-8px_0px_0px_black] z-50 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
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
