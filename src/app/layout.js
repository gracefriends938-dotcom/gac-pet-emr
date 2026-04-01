import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pet EMR | G.A.Cアニマルクリニック",
  description: "Electronic Medical Record system for G.A.Cアニマルクリニック",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 h-screen flex overflow-hidden`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
