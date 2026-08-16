import Link from "next/link";
import {
    IconLogin2,
    IconLogout2,
    IconGlobe,
    IconBrandInstagram,
    IconBrandTwitter,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/server";

export default async function PublicHeader() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <header className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-3 rounded-[1.2rem] border-[3px] border-black bg-white/92 px-4 py-1.5 shadow-[4px_4px_0px_black] backdrop-blur sm:px-6">
            <Link href="/" className="flex items-center gap-2">
                <div className="rounded-[8px] border-2 border-black bg-lime-300 px-3 py-1 font-bold shadow-[2px_2px_0px_black] text-black flex items-center justify-center font-malayalam text-lg md:text-xl leading-none select-none">
                    മ
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500 leading-none mb-0.5">
                        MalluTyping
                    </p>
                    <h1 className="text-base font-black text-slate-900 leading-none">
                        Malayalam Typing
                    </h1>
                </div>
            </Link>

            <div className="flex items-center gap-2">
                {/* Portfolio & Socials */}
                <a
                    href="https://nihalt.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1 rounded-full border-2 border-black bg-white px-2.5 py-1 text-[10px] font-black shadow-[1.5px_1.5px_0px_black] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-slate-800"
                >
                    <IconGlobe size={11} />
                    <span>nihalt.in</span>
                </a>

                <a
                    href="https://instagram.com/_nihaal_t"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center justify-center rounded-full border-2 border-black bg-[#fdf2f8] p-1.5 text-[#db2777] shadow-[1.5px_1.5px_0px_black] hover:bg-pink-100 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    title="Instagram"
                >
                    <IconBrandInstagram size={12} />
                </a>

                <a
                    href="https://x.com/_nihaal_t"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center justify-center rounded-full border-2 border-black bg-slate-900 p-1.5 text-white shadow-[1.5px_1.5px_0px_black] hover:bg-slate-800 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    title="Twitter / X"
                >
                    <IconBrandTwitter size={12} />
                </a>

                <Link
                    href="/practice"
                    className="rounded-full border-2 border-black bg-[#fef08a] px-3 py-1 text-xs font-black text-slate-900 shadow-[2px_2px_0px_black] hover:bg-yellow-200 transition-colors"
                >
                    Practice
                </Link>

                <Link
                    href="/keyboard"
                    className="rounded-full border-2 border-black bg-[#eaf9fc] px-3 py-1 text-xs font-black text-slate-900 shadow-[2px_2px_0px_black] hover:bg-cyan-100 transition-colors"
                >
                    Keyboard
                </Link>

                {user ? (
                    <a
                        href="/auth/logout"
                        className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-black text-slate-900 shadow-[2px_2px_0px_black]"
                    >
                        <IconLogout2 size={14} />
                        Logout
                    </a>
                ) : (
                    <Link
                        href="/login?next=/"
                        className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-black text-slate-900 shadow-[2px_2px_0px_black]"
                    >
                        <IconLogin2 size={14} />
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
}
