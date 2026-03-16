import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pet EMR | Grace Animal Clinic",
  description: "Electronic Medical Record system for Grace Animal Clinic",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 h-screen flex overflow-hidden`}
      >
        <Sidebar />
        <div className="flex flex-col flex-1 h-full min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
