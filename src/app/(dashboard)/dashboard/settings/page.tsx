import { requireUser } from "@/lib/auth";

export default async function SettingsPage() {
    const { supabase, user } = await requireUser();
    const { data: settings } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    return (
        <section className="rounded-[2rem] border-[3px] border-black bg-white/90 p-6 shadow-[6px_6px_0px_black]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                Settings
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">
                Account preferences
            </h1>
            <div className="mt-5 space-y-2 text-sm font-medium text-slate-600">
                <p>Theme: {settings?.theme || "light"}</p>
                <p>Sound: {settings?.sound ? "Enabled" : "Disabled"}</p>
                <p>Animation speed: {settings?.animation_speed ?? 1}</p>
            </div>
        </section>
    );
}
