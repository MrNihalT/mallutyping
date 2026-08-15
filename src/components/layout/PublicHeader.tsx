import Link from "next/link";
import { IconKeyboard, IconLogin2, IconLogout2 } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/server";

export default async function PublicHeader() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <header className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-3 rounded-[2rem] border-[3px] border-black bg-white/92 px-4 py-3 shadow-[6px_6px_0px_black] backdrop-blur sm:px-6">
            <Link href="/" className="flex items-center gap-3">
                <div className="rounded-full border-2 border-black bg-[#c7f43e] p-2">
                    <IconKeyboard size={22} />
                </div>
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">
                        MalluTyping
                    </p>
                    <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
                        Malayalam Typing
                    </h1>
                </div>
            </Link>

            <div className="flex items-center gap-3">
                <Link
                    href="/keyboard"
                    className="rounded-full border-2 border-black bg-[#eaf9fc] px-4 py-2 text-sm font-black text-slate-900 shadow-[3px_3px_0px_black]"
                >
                    Keyboard
                </Link>

                {user ? (
                    <Link
                        href="/auth/logout"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-black text-slate-900 shadow-[3px_3px_0px_black]"
                    >
                        <IconLogout2 size={16} />
                        Logout
                    </Link>
                ) : (
                    <Link
                        href="/login?next=/"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-black text-slate-900 shadow-[3px_3px_0px_black]"
                    >
                        <IconLogin2 size={16} />
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
}
