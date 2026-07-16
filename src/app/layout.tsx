import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NotificationManager from "@/components/NotificationManager"; // 1. Import เข้ามา

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyMedicine",
  description: "ระบบช่วยจัดการการรับประทานยาและแจ้งเตือน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${geist.className} antialiased bg-zinc-950 text-zinc-50`}>
        {/* 2. เรียกใช้งานระบบแจ้งเตือน (ทำงานเบื้องหลัง) */}
        <NotificationManager />

        <div className="hidden md:block">
          <Navbar />
        </div>
        
        <div className="pb-20 md:pb-0">
          {children}
        </div>

        <div className="md:hidden">
          <Navbar />
        </div>
      </body>
    </html>
  );
}