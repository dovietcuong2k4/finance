import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import BottomNav from "@/components/bottom-nav";
import FlutterHandler from "@/components/flutter-handler";
import { getUser } from "@/app/auth/actions";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura Moni | Modern Personal Expense Manager",
  description: "Quản lý tài chính cá nhân thông minh với sự hỗ trợ của AI.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch user data once at layout level — shared by Sidebar + pages
  const user = await getUser();

  return (
    <html lang="vi" className="h-full">
      <body className={`${inter.className} h-screen flex flex-col md:flex-row bg-background overflow-hidden`}>
        <FlutterHandler />
        <Toaster position="top-center" />
        <Sidebar userData={user} />
        <main className="flex-1 flex flex-col min-w-0 overflow-auto pb-[calc(env(safe-area-inset-bottom)+4rem)] md:pb-0">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
