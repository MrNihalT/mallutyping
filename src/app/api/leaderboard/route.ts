import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const duration = parseInt(searchParams.get("duration") ?? "30", 10);

    const supabase = await createClient();

    const { data: scores, error } = await supabase
        .from("practice_leaderboard")
        .select("id, username, wpm, accuracy, created_at")
        .eq("duration", duration)
        .order("wpm", { ascending: false })
        .order("accuracy", { ascending: false })
        .limit(10);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ scores: scores ?? [] });
}

export async function POST(request: Request) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const body = (await request.json()) as {
        username?: string;
        wpm?: number;
        accuracy?: number;
        duration?: number;
    };

    const wpm = Math.max(0, Math.round(body.wpm ?? 0));
    const accuracy = Math.max(0, Math.min(100, Math.round(body.accuracy ?? 0)));
    const duration = Math.max(0, Math.round(body.duration ?? 30));

    let finalUsername = (body.username ?? "Guest").trim();
    if (!finalUsername) {
        finalUsername = "Guest";
    }

    let userId: string | null = null;

    if (user) {
        userId = user.id;
        // Fetch official profile username to prevent spoofing
        const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .maybeSingle();

        if (profile?.username) {
            finalUsername = profile.username;
        }
    }

    const { error } = await supabase.from("practice_leaderboard").insert({
        user_id: userId,
        username: finalUsername.substring(0, 20), // Max 20 chars
        wpm,
        accuracy,
        duration,
    });

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
}
