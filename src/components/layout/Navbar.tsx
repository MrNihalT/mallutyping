import Link from "next/link";
import {
    IconKeyboard,
    IconLogin2,
    IconLogout2,
    IconUserPlus,
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
                <div className="rounded-full border-2 border-black bg-lime-300 p-2">
                    <IconKeyboard size={24} />
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

            <div className="flex flex-wrap gap-3">
                {user ? (
                    <Link
                        href="/auth/logout"
                        className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-5 py-3 shadow-[3px_3px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                        <IconLogout2 size={20} />
                        Logout
                    </Link>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-5 py-3 shadow-[3px_3px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none"
                        >
                            <IconLogin2 size={20} />
                            Login
                        </Link>

                        <Link
                            href="/register"
                            className="flex items-center gap-2 rounded-full border-2 border-black bg-lime-300 px-5 py-3 shadow-[3px_3px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none"
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
