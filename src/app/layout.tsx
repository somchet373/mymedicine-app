import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // 1. Import Navbar

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
        {/* สำหรับหน้าจอ Desktop Navbar จะอยู่ด้านบน */}
        <div className="hidden md:block">
          <Navbar />
        </div>
        
        {/* พื้นที่แสดงหน้าเว็บหลัก (เว้นที่ว่างด้านล่างไว้เผื่อ Navbar มือถือ) */}
        <div className="pb-20 md:pb-0">
          {children}
        </div>

        {/* สำหรับหน้าจอมือถือ Navbar จะเกาะอยู่ด้านล่าง */}
        <div className="md:hidden">
          <Navbar />
        </div>
      </body>
    </html>
  );
}