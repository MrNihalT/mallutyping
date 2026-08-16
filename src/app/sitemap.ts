import { MetadataRoute } from "next";
import { trainerLessons } from "@/lib/trainer-lessons";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://mallutyping.nihalt.in/";

    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/keyboard`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
    ];

    const lessonPages = trainerLessons.map((lesson) => ({
        url: `${baseUrl}/lesson/${lesson.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [...staticPages, ...lessonPages];
}
