import { createClient } from "@/lib/supabase/server";
import Navbar from "./Navbar";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div className="sky-wash paper-grid relative min-h-screen overflow-x-hidden">
            <Navbar
                user={
                    user
                        ? {
                              email: user.email ?? "",
                              fullName:
                                  (user.user_metadata.full_name as string | undefined) ?? "",
                              username:
                                  (user.user_metadata.username as string | undefined) ?? "",
                          }
                        : null
                }
            />
            <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 page-transition">
                {children}
            </main>
        </div>
    );
}
