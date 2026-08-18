import { createClient } from "@/lib/supabase/server";
import PublicHeaderClient from "./PublicHeaderClient";

export default async function PublicHeader() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return <PublicHeaderClient user={user} />;
}
