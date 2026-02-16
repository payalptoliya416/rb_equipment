import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import ToastProvider from "@/components/common/ToastProvider";
import { SettingsProvider } from "@/contexts/SettingsContext";
import MetadataUpdater from "@/components/common/MetadataUpdater";

// ---------------- MONT FONT ----------------
const mont = localFont({
  src: [
    { path: "../public/fonts/Mont/Mont-Light.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Mont/Mont-Regular.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Mont/Mont-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/Mont/Mont-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-mont",
  display: "swap",
});

// ---------------- SF PRO FONT ----------------

const sfPro = localFont({
  src: [
    { path: "../public/fonts/SF-Pro-Text/SF-Pro-Text-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/SF-Pro-Text/SF-Pro-Text-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/SF-Pro-Text/SF-Pro-Text-Semibold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/SF-Pro-Text/SF-Pro-Text-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-sfpro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stiopa Equipment",
  description: "",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${mont.variable} ${sfPro.variable} antialiased`}
        suppressHydrationWarning
      >
        <SettingsProvider>
          <MetadataUpdater />
          {children}
          <ToastProvider />
        </SettingsProvider>
      </body>
    </html>
  );
}
