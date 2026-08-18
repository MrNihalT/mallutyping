"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconUserPlus } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();

    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const cleanUsername = username.trim().toLowerCase();
        const cleanEmail = email.trim();

        if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
            setError("Username must be 3-20 characters and use only letters, numbers, or underscore.");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        const { data: existingUser, error: usernameError } = await supabase
            .from("profiles")
            .select("username")
            .eq("username", cleanUsername)
            .maybeSingle();

        if (usernameError) {
            setError(usernameError.message);
            setLoading(false);
            return;
        }

        if (existingUser) {
            setError("Username already taken.");
            setLoading(false);
            return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
                data: {
                    username: cleanUsername,
                    full_name: fullName.trim(),
                },
                emailRedirectTo:
                    typeof window === "undefined"
                        ? undefined
                        : `${window.location.origin}/callback`,
            },
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        if (data.user?.id) {
            await supabase
                .from("profiles")
                .update({
                    username: cleanUsername,
                })
                .eq("id", data.user.id);
        }

        setSuccess("Account created. Please check your email to confirm your account.");
        setLoading(false);
    }

    return (
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
            <div className="w-full max-w-xl rounded-[2rem] border-[3px] border-black bg-white/95 p-8 shadow-[8px_8px_0px_black]">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#eaf9fc] px-4 py-2 text-sm font-black shadow-[3px_3px_0px_black]"
                >
                    <IconArrowLeft size={16} />
                    Back Home
                </Link>

                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-full border-2 border-black bg-[#b3f023] p-3 shadow-[3px_3px_0px_black]">
                        <IconUserPlus size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                            Create account
                        </p>
                        <h1 className="text-3xl font-black text-slate-900">
                            Join MalluTyping
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-black uppercase tracking-wide text-slate-700"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                required
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                className="w-full rounded-2xl border-[3px] border-black bg-white px-4 py-3 font-medium text-slate-900 outline-none"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="fullName"
                                className="mb-2 block text-sm font-black uppercase tracking-wide text-slate-700"
                            >
                                Full name
                            </label>
                            <input
                                id="fullName"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                className="w-full rounded-2xl border-[3px] border-black bg-white px-4 py-3 font-medium text-slate-900 outline-none"
                            />
                        </div>
                    </div>

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

                    <div className="grid gap-4 sm:grid-cols-2">
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
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-2xl border-[3px] border-black bg-white px-4 py-3 font-medium text-slate-900 outline-none"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-black uppercase tracking-wide text-slate-700"
                            >
                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                className="w-full rounded-2xl border-[3px] border-black bg-white px-4 py-3 font-medium text-slate-900 outline-none"
                            />
                        </div>
                    </div>

                    {error ? (
                        <div className="rounded-2xl border-[3px] border-black bg-[#ffe0de] px-4 py-3 text-sm font-bold text-red-700 shadow-[3px_3px_0px_black]">
                            {error}
                        </div>
                    ) : null}

                    {success ? (
                        <div className="rounded-2xl border-[3px] border-black bg-[#e4ffd8] px-4 py-3 text-sm font-bold text-green-700 shadow-[3px_3px_0px_black]">
                            {success}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full border-[3px] border-black bg-[#b3f023] px-6 py-3 text-base font-black text-slate-900 shadow-[4px_4px_0px_black] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                    <div className="h-[2px] flex-1 bg-slate-200" />
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Or
                    </span>
                    <div className="h-[2px] flex-1 bg-slate-200" />
                </div>

                <GoogleAuthButton mode="register" />

                <p className="mt-5 text-sm font-medium text-slate-600">
                    Already have an account?{" "}
                    <Link href="/login" className="font-black text-slate-900 underline">
                        Sign in here
                    </Link>
                    .
                </p>
            </div>

            {/* Email Confirmation Modal */}
            {success && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="relative max-w-md w-full rounded-[2rem] border border-slate-900/10 bg-white/95 p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-scale-in">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-lime-100 text-lime-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 font-sans">Confirm your email</h2>
                        <p className="mt-3 text-sm font-semibold text-slate-600">
                            We have sent a verification link to:
                        </p>
                        <p className="mt-1 font-bold text-slate-950 select-all">{email}</p>
                        <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                            Please click the confirmation link inside the email to activate and verify your account.
                        </p>
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={() => router.push("/login")}
                                className="w-full rounded-full border border-slate-900/10 bg-[#b3f023] py-2.5 text-sm font-black text-slate-900 shadow-sm hover:bg-[#a2de1b] active:scale-95 transition-all cursor-pointer"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
