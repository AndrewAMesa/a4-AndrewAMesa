import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientSessionWrapper from "./clientsessionwrapper";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Focusly App",
    description: "Task management app",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <head>
            <title>{metadata.title?.toString() ?? "Default Title"}</title>
            <meta name="description" content={metadata.description?.toString() ?? "Default Description"}/>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ClientSessionWrapper>{children}</ClientSessionWrapper>
        </body>
        </html>
    );
}
