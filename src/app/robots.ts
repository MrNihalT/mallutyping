import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://mallutyping.vercel.app";

    return {
        rules: {
            userAgent: "*",
            allow: ["/", "/keyboard", "/lesson/"],
            disallow: ["/dashboard/", "/login", "/register", "/api/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
