import Link from "next/link";
import { IconChartBar, IconSettings, IconUserCircle } from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
    const { supabase, user } = await requireUser();

    const [{ data: profile }, { data: statistics }, { data: settings }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("statistics").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("settings").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    return (
        <div className="space-y-6">
            <section className="rounded-[2rem] border-[3px] border-black bg-white/90 p-6 shadow-[6px_6px_0px_black]">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                    Dashboard
                </p>
                <h1 className="mt-2 text-4xl font-black text-slate-900">
                    Welcome back,{" "}
                    {profile?.username ||
                        (user.user_metadata.full_name as string | undefined) ||
                        user.email}
                </h1>
                <p className="mt-3 text-base font-medium text-slate-600">
                    Your MalluTyping account is connected to Supabase and ready to store lessons, settings, and performance.
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] border-[3px] border-black bg-white p-5 shadow-[4px_4px_0px_black]">
                    <div className="mb-3 flex items-center gap-3">
                        <IconUserCircle className="text-slate-700" size={24} />
                        <h2 className="text-xl font-black text-slate-800">Profile</h2>
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                        Username: {profile?.username || "Not set"}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                        Full name:{" "}
                        {(user.user_metadata.full_name as string | undefined) || "Not set"}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                        Joined:{" "}
                        {profile?.created_at
                            ? new Date(profile.created_at).toLocaleDateString()
                            : "Not set"}
                    </p>
                </div>

                <div className="rounded-[1.5rem] border-[3px] border-black bg-white p-5 shadow-[4px_4px_0px_black]">
                    <div className="mb-3 flex items-center gap-3">
                        <IconChartBar className="text-slate-700" size={24} />
                        <h2 className="text-xl font-black text-slate-800">Statistics</h2>
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                        Lessons completed: {statistics?.total_lessons ?? 0}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                        Average WPM: {statistics?.average_wpm ?? 0}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                        Best WPM: {statistics?.best_wpm ?? 0}
                    </p>
                </div>

                <div className="rounded-[1.5rem] border-[3px] border-black bg-white p-5 shadow-[4px_4px_0px_black]">
                    <div className="mb-3 flex items-center gap-3">
                        <IconSettings className="text-slate-700" size={24} />
                        <h2 className="text-xl font-black text-slate-800">Settings</h2>
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                        Theme: {settings?.theme || "light"}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                        Sound: {settings?.sound ? "On" : "Off"}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                        Animation speed: {settings?.animation_speed ?? 1}
                    </p>
                </div>
            </section>

            <section className="flex flex-wrap gap-3">
                <Link
                    href="/dashboard/profile"
                    className="rounded-full border-[3px] border-black bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-[3px_3px_0px_black]"
                >
                    Open profile
                </Link>
                <Link
                    href="/dashboard/settings"
                    className="rounded-full border-[3px] border-black bg-[#c7f43e] px-5 py-3 text-sm font-black text-slate-900 shadow-[3px_3px_0px_black]"
                >
                    Open settings
                </Link>
            </section>
        </div>
    );
}
