import Link from "next/link";
import {
    IconKeyboard,
    IconLogin2,
    IconLogout2,
    IconUserPlus,
    IconBrandInstagram,
    IconBrandTwitter,
    IconGlobe,
} from "@tabler/icons-react";

type NavbarUser = {
    email: string;
    fullName: string;
    username: string;
};

export default function Navbar({ user }: { user: NavbarUser | null }) {
    return (
        <header className="relative z-20 mx-auto flex max-w-7xl flex-col gap-4 rounded-[2rem] border-[3px] border-black bg-white/90 px-5 py-4 shadow-[6px_6px_0px_black] backdrop-blur sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex items-center gap-3">
                <div className="rounded-[10px] border-2 border-black bg-[#c084fc] px-3.5 py-1.5 font-bold shadow-[2.5px_2.5px_0px_black] text-black flex items-center justify-center font-malayalam text-2xl md:text-3xl leading-none select-none">
                    മ
                </div>

                <h1 className="text-3xl font-black sm:text-4xl">
                    Mallu<span className="text-gray-400">Typing</span>
                </h1>
            </Link>

            <Link
                href="/keyboard"
                data-chip="true"
                className="rounded-full border-2 border-black bg-[#eaf9fc] px-4 py-2 text-sm font-bold shadow-[3px_3px_0px_black]"
            >
                <span className="flex items-center gap-2">
                    <IconKeyboard size={16} />
                    Keyboard
                </span>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
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
        </header>
    );
}
