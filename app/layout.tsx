import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { MediaModeWrapper } from "@/components/MediaModeWrapper";
import { TopNav } from "@/components/top-nav";
import { SiteFooter } from "@/components/footer/SiteFooter";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "Softmaxxer — Evidence-Based Skincare Routine Optimization",
  description: "Build a personalized skincare routine based on your skin's unique needs. Get product recommendations, track consistency, and optimize results with evidence-based guidance.",
  keywords: ["skincare", "routine", "personalized skincare", "skin analysis", "product recommendations", "skincare tracker"],
  authors: [{ name: "Soft Productivity" }],
  creator: "Soft Productivity",
  publisher: "Soft Productivity",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://softmaxxer.com",
    siteName: "Softmaxxer",
    title: "Softmaxxer — Evidence-Based Skincare Routine Optimization",
    description: "Build a personalized skincare routine based on your skin's unique needs. Get product recommendations, track consistency, and optimize results.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Softmaxxer - Evidence-Based Skincare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Softmaxxer — Evidence-Based Skincare Routine Optimization",
    description: "Build a personalized skincare routine based on your skin's unique needs.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${manrope.variable} ${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        <TopNav />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <SiteFooter />
        <MediaModeWrapper />
      </body>
    </html>
  );
}
