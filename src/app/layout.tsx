import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";
import SupportWidget from "@/components/ui/SupportWidget";

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
    title: "MalluTyping - Malayalam Typing Practice, Keyboard & Speed Test Online",
    description:
        "Easy, fast, and accurate Malayalam typing online. Practice Malayalam typing with structured lessons, an interactive Malayalam keyboard layout reference, and real-time typing speed tests. Ideal for learning Malayalam typing and improving typing speed.",
    keywords: [
        "malayalam typing",
        "malayalam keyboard",
        "learn malayalam typing",
        "malayalam",
        "malayalam typing online",
        "malayalam keyboard online",
        "english to malayalam typing",
        "malayalam typing practice",
        "malayalam speed test",
        "malayalam typing speed test",
        "malayalam key map",
        "malayalam inscript keyboard",
        "mallu typing",
        "malayalam keyboard layout",
        "learn to type malayalam",
        "online malayalam typing",
        "malayalam typing tutor",
        "malayalam typing lessons",
        "desh keyboard online",
        "google malayalam typing",
        "മലയാളം ടൈപ്പിംഗ്",
        "മലയാളം കീബോർഡ്",
        "മലയാളം എഴുത്ത്",
        "manglish keyboard",
        "manglish typing",
        "malayalam alphabet keyboard",
        "malayalam typing test online"
    ],
    authors: [{ name: "Zoxilsi" }],
    creator: "Zoxilsi",
    publisher: "Zoxilsi",
    openGraph: {
        title: "MalluTyping - Malayalam Typing Practice, Keyboard & Speed Test Online",
        description:
            "Easy, fast, and accurate Malayalam typing online. Practice Malayalam typing with structured lessons, an interactive Malayalam keyboard layout reference, and real-time typing speed tests.",
        url: "https://mallutyping.vercel.app",
        siteName: "MalluTyping",
        type: "website",
        locale: "ml_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "MalluTyping - Malayalam Typing Practice, Keyboard & Speed Test Online",
        description:
            "Easy, fast, and accurate Malayalam typing online. Practice Malayalam typing with structured lessons, an interactive Malayalam keyboard layout reference, and real-time typing speed tests.",
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
                <SupportWidget />
                <Script
                    id="bmc-widget"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
                            var script = document.createElement("script");
                            script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
                            script.setAttribute("data-name", "BMC-Widget");
                            script.setAttribute("data-cfasync", "false");
                            script.setAttribute("data-id", "nihalt");
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
