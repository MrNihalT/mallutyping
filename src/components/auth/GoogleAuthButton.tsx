"use client";

import { useState } from "react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";

type GoogleAuthButtonProps = {
    mode: "login" | "register";
};

export default function GoogleAuthButton({
    mode,
}: GoogleAuthButtonProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleGoogleAuth() {
        setError("");
        setLoading(true);

        const redirectTo =
            typeof window === "undefined"
                ? undefined
                : `${window.location.origin}/callback`;

        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo,
                queryParams: {
                    access_type: "offline",
                    prompt: "select_account",
                },
            },
        });

        if (oauthError) {
            setError(oauthError.message);
            setLoading(false);
        }
    }

    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-full border-[3px] border-black bg-white px-6 py-3 text-base font-black text-slate-900 shadow-[4px_4px_0px_black] disabled:cursor-not-allowed disabled:opacity-70"
            >
                <IconBrandGoogle size={20} />
                {loading
                    ? "Connecting..."
                    : mode === "login"
                      ? "Continue with Google"
                      : "Sign up with Google"}
            </button>

            {error ? (
                <div className="rounded-2xl border-[3px] border-black bg-[#ffe0de] px-4 py-3 text-sm font-bold text-red-700 shadow-[3px_3px_0px_black]">
                    {error}
                </div>
            ) : null}
        </div>
    );
}
