import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
    const { supabase, user } = await requireUser();
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    return (
        <section className="rounded-[2rem] border-[3px] border-black bg-white/90 p-6 shadow-[6px_6px_0px_black]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                Profile
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">
                {profile?.username || user.email}
            </h1>
            <div className="mt-5 space-y-2 text-sm font-medium text-slate-600">
                <p>Email: {user.email}</p>
                <p>
                    Full name:{" "}
                    {(user.user_metadata.full_name as string | undefined) || "Not set"}
                </p>
                <p>Username: {profile?.username || "Not set"}</p>
                <p>
                    Joined:{" "}
                    {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString()
                        : "Not set"}
                </p>
            </div>
        </section>
    );
}
