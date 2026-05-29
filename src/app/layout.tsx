import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import BottomNav from "@/components/bottom-nav";
import FlutterHandler from "@/components/flutter-handler";
import JsonLd from "@/components/json-ld";
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
  title: "Aura Moni | Quản lý chi tiêu cá nhân thông minh",
  description: "Aura Moni giúp bạn quản lý tài chính cá nhân dễ dàng với AI, theo dõi chi tiêu, lập ngân sách và báo cáo trực quan.",
  keywords: ["quản lý tài chính", "quản lý chi tiêu", "tiết kiệm", "ngân sách", "tài chính cá nhân", "Aura Moni"],
  authors: [{ name: "Aura Moni Team" }],
  creator: "Aura Moni",
  publisher: "Aura Moni",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://finance-flame-delta.vercel.app'), // Replace with actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Aura Moni | Quản lý chi tiêu cá nhân thông minh",
    description: "Theo dõi dòng tiền, lập kế hoạch tài chính và tối ưu hóa chi tiêu với sự hỗ trợ của trí tuệ nhân tạo.",
    url: 'https://finance-flame-delta.vercel.app',
    siteName: 'Aura Moni',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Aura Moni Logo',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Aura Moni | Quản lý chi tiêu cá nhân thông minh",
    description: "Quản lý tài chính cá nhân hiện đại với Aura Moni.",
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'ER4uxVq-PtcOm_G3qavbY9ePo5SyjaqatANml4TFi_Y',
  },
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
      <head>
        <JsonLd />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z3HD6F4CES"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Z3HD6F4CES');
          `}
        </Script>
      </head>
      <body className={`${inter.className} h-screen flex flex-col md:flex-row bg-background overflow-hidden`}>
        <FlutterHandler />
        <Toaster position="top-center" />
        <Sidebar userData={user} />
        <main className="flex-1 flex flex-col min-w-0 overflow-auto pt-[calc(env(safe-area-inset-top)+1rem)] md:pt-0 pb-[calc(env(safe-area-inset-bottom)+4rem)] md:pb-0">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
