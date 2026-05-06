import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Sidebar from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura Finance | Modern Corporate Expense Manager",
  description: "Quản lý tài chính cá nhân thông minh với sự hỗ trợ của AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className={`${inter.className} min-h-full flex bg-background`}>
        <Toaster position="top-center" />
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
