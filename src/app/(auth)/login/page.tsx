"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IconArrowLeft, IconLogin2 } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        if (signInError) {
            setError(signInError.message);
            setLoading(false);
            return;
        }

        router.push(searchParams.get("next") || "/dashboard");
        router.refresh();
    }

    return (
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
            <div className="w-full max-w-md rounded-[2rem] border-[3px] border-black bg-white/95 p-8 shadow-[8px_8px_0px_black]">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#eaf9fc] px-4 py-2 text-sm font-black shadow-[3px_3px_0px_black]"
                >
                    <IconArrowLeft size={16} />
                    Back Home
                </Link>

                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-full border-2 border-black bg-[#b3f023] p-3 shadow-[3px_3px_0px_black]">
                        <IconLogin2 size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                            Secure login
                        </p>
                        <h1 className="text-3xl font-black text-slate-900">
                            Sign in to MalluTyping
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-black uppercase tracking-wide text-slate-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-2xl border-[3px] border-black bg-white px-4 py-3 font-medium text-slate-900 outline-none"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-black uppercase tracking-wide text-slate-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-2xl border-[3px] border-black bg-white px-4 py-3 font-medium text-slate-900 outline-none"
                        />
                    </div>

                    {error ? (
                        <div className="rounded-2xl border-[3px] border-black bg-[#ffe0de] px-4 py-3 text-sm font-bold text-red-700 shadow-[3px_3px_0px_black]">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full border-[3px] border-black bg-[#b3f023] px-6 py-3 text-base font-black text-slate-900 shadow-[4px_4px_0px_black] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                    <div className="h-[2px] flex-1 bg-slate-200" />
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Or
                    </span>
                    <div className="h-[2px] flex-1 bg-slate-200" />
                </div>

                <GoogleAuthButton mode="login" />

                <p className="mt-5 text-sm font-medium text-slate-600">
                    Need an account?{" "}
                    <Link href="/register" className="font-black text-slate-900 underline">
                        Create one here
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
