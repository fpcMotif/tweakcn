import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { AuthDialogWrapper } from "@/components/auth-dialog-wrapper";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { DynamicFontLoader } from "@/components/dynamic-font-loader";
import { GetProDialogWrapper } from "@/components/get-pro-dialog-wrapper";
import { PostHogInit } from "@/components/posthog-init";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChatProvider } from "@/hooks/use-chat-context";
import { QueryProvider } from "@/lib/query-client";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beautiful themes for shadcn/ui — tweakcn | Theme Editor & Generator",
  description:
    "Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time.",
  keywords:
    "theme editor, theme generator, shadcn, ui, components, react, tailwind, button, editor, visual editor, component editor, web development, frontend, design system, UI components, React components, Tailwind CSS, shadcn/ui themes",
  authors: [{ name: "Sahaj Jain" }],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title:
      "Beautiful themes for shadcn/ui — tweakcn | Theme Editor & Generator",
    description:
      "Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time.",
    url: "https://tweakcn.com/",
    siteName: "tweakcn",
    images: [
      {
        url: "https://tweakcn.com/og-image.v050725.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Beautiful themes for shadcn/ui — tweakcn | Theme Editor & Generator",
    description:
      "Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time.",
    images: ["https://tweakcn.com/og-image.v050725.png"],
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <DynamicFontLoader />

        {/* Font preconnect for Google Fonts - following Next.js 16 best practices */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />

        <meta name="darkreader-lock" />
      </head>
      <body>
        <ConvexAuthNextjsServerProvider>
          <NuqsAdapter>
            <Suspense>
              <ConvexClientProvider>
                <QueryProvider>
                  <ThemeProvider defaultTheme="light">
                    <TooltipProvider>
                      <AuthDialogWrapper />
                      <GetProDialogWrapper />
                      <Toaster />
                      <ChatProvider>{children}</ChatProvider>
                    </TooltipProvider>
                  </ThemeProvider>
                </QueryProvider>
              </ConvexClientProvider>
            </Suspense>
          </NuqsAdapter>
          <PostHogInit />
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
