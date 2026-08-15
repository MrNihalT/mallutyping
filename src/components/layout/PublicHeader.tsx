import Link from "next/link";
import { IconKeyboard, IconLogin2, IconLogout2 } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/server";

export default async function PublicHeader() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <header className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-3 rounded-[1.2rem] border-[3px] border-black bg-white/92 px-4 py-1.5 shadow-[4px_4px_0px_black] backdrop-blur sm:px-6">
            <Link href="/" className="flex items-center gap-2">
                <div className="rounded-full border-2 border-black bg-[#c7f43e] p-1.5">
                    <IconKeyboard size={18} />
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
                <Link
                    href="/keyboard"
                    className="rounded-full border-2 border-black bg-[#eaf9fc] px-3 py-1 text-xs font-black text-slate-900 shadow-[2px_2px_0px_black]"
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
