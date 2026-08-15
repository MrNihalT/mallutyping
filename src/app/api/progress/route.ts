import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return Response.json({ authenticated: false });
    }

    const [{ data: progress }, { data: statistics }, { data: settings }, { data: profile }] =
        await Promise.all([
            supabase
                .from("progress")
                .select("lesson_id, completed, best_wpm, accuracy, stars")
                .eq("user_id", user.id)
                .order("lesson_id"),
            supabase.from("statistics").select("*").eq("user_id", user.id).maybeSingle(),
            supabase.from("settings").select("*").eq("user_id", user.id).maybeSingle(),
            supabase.from("profiles").select("username").eq("id", user.id).maybeSingle(),
        ]);

    return Response.json({
        authenticated: true,
        user: {
            email: user.email ?? "",
            username: profile?.username ?? "",
        },
        progress: progress ?? [],
        statistics: statistics ?? null,
        settings: settings ?? null,
    });
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return Response.json({ authenticated: false }, { status: 401 });
    }

    const body = (await request.json()) as {
        lessonId?: number;
        accuracy?: number;
        wpm?: number;
        mistakes?: number;
        stars?: number;
        totalKeys?: number;
        timeSpent?: number;
    };

    if (!body.lessonId) {
        return Response.json({ error: "lessonId is required" }, { status: 400 });
    }

    const lessonId = body.lessonId;
    const accuracy = Math.max(0, Math.round(body.accuracy ?? 0));
    const wpm = Math.max(0, Math.round(body.wpm ?? 0));
    const mistakes = Math.max(0, Math.round(body.mistakes ?? 0));
    const stars = Math.max(1, Math.min(3, Math.round(body.stars ?? 1)));
    const totalKeys = Math.max(0, Math.round(body.totalKeys ?? 0));
    const timeSpent = Math.max(0, Math.round(body.timeSpent ?? 0));

    const { data: existingProgress } = await supabase
        .from("progress")
        .select("id, best_wpm, accuracy, stars")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

    await supabase.from("lesson_attempts").insert({
        user_id: user.id,
        lesson_id: lessonId,
        wpm,
        accuracy,
        mistakes,
    });

    if (existingProgress?.id) {
        await supabase
            .from("progress")
            .update({
                completed: true,
                accuracy: Math.max(existingProgress.accuracy ?? 0, accuracy),
                best_wpm: Math.max(existingProgress.best_wpm ?? 0, wpm),
                stars: Math.max(existingProgress.stars ?? 0, stars),
                updated_at: new Date().toISOString(),
            })
            .eq("id", existingProgress.id);
    } else {
        await supabase.from("progress").insert({
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            accuracy,
            best_wpm: wpm,
            stars,
        });
    }

    const [{ data: completedRows }, { data: currentStats }] = await Promise.all([
        supabase
            .from("progress")
            .select("lesson_id, best_wpm, accuracy")
            .eq("user_id", user.id)
            .eq("completed", true),
        supabase.from("statistics").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    const totalLessons = completedRows?.length ?? 0;
    const averageWpm =
        totalLessons > 0
            ? Math.round(
                  (completedRows ?? []).reduce(
                      (sum, row) => sum + (row.best_wpm ?? 0),
                      0,
                  ) / totalLessons,
              )
            : 0;
    const bestWpm = Math.max(0, ...(completedRows ?? []).map((row) => row.best_wpm ?? 0));
    const averageAccuracy =
        totalLessons > 0
            ? Math.round(
                  (completedRows ?? []).reduce(
                      (sum, row) => sum + (row.accuracy ?? 0),
                      0,
                  ) / totalLessons,
              )
            : 0;

    await supabase.from("statistics").upsert({
        user_id: user.id,
        total_lessons: totalLessons,
        average_wpm: averageWpm,
        best_wpm: bestWpm,
        accuracy: averageAccuracy,
        total_keys: (currentStats?.total_keys ?? 0) + totalKeys,
        time_spent: (currentStats?.time_spent ?? 0) + timeSpent,
    });

    return Response.json({
        authenticated: true,
        lessonId,
        saved: true,
    });
}
