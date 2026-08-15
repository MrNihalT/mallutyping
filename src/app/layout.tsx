import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const notoSansMalayalam = Noto_Sans_Malayalam({
    variable: "--font-malayalam",
    subsets: ["malayalam", "latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://mallutyping.vercel.app"),
    title: "MalluTyping | Malayalam Typing Practice & Speed Test",
    description:
        "Practice Malayalam typing with structured lessons, a visual keyboard, and speed-focused drills built for learners.",
    keywords: [
        "malayalam typing",
        "malayalam keyboard",
        "mallu typing",
        "malayalam typing practice",
        "malayalam typing lessons",
        "malayalam speed test",
        "malayalam inscript keyboard",
        "learn malayalam typing",
    ],
    authors: [{ name: "Zoxilsi" }],
    creator: "Zoxilsi",
    publisher: "Zoxilsi",
    openGraph: {
        title: "MalluTyping | Malayalam Typing Practice & Speed Test",
        description:
            "Learn Malayalam typing with guided lessons, keyboard mapping, and performance tracking.",
        url: "https://mallutyping.vercel.app",
        siteName: "MalluTyping",
        type: "website",
        locale: "ml_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "MalluTyping | Malayalam Typing Practice & Speed Test",
        description:
            "A Malayalam typing platform with lessons, keymap guidance, and clean practice flows.",
        creator: "@zoxilsi",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} ${notoSansMalayalam.variable}`}
        >
            <body>
                {children}
                <Script
                    id="bmc-widget"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
                            var script = document.createElement("script");
                            script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
                            script.setAttribute("data-name", "BMC-Widget");
                            script.setAttribute("data-cfasync", "false");
                            script.setAttribute("data-id", "hizoxilsij");
                            script.setAttribute("data-description", "Support MalluTyping");
                            script.setAttribute("data-message", "");
                            script.setAttribute("data-color", "#B3F023");
                            script.setAttribute("data-position", "Right");
                            script.setAttribute("data-x_margin", "18");
                            script.setAttribute("data-y_margin", "18");
                            document.body.appendChild(script);
                        `,
                    }}
                />
            </body>
        </html>
    );
}
