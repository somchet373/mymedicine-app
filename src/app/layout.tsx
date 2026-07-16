import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NotificationManager from "@/components/NotificationManager";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "MyMedicine | ระบบจัดการการรับประทานยา",
  description: "ระบบช่วยจัดการการรับประทานยาและแจ้งเตือน",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  return <html lang="th"><body className="antialiased bg-[#f6f8fc] text-slate-900"><NotificationManager /><div className="hidden md:block"><Navbar role={session?.role} name={session?.name} /></div><div className="pb-20 md:pb-0">{children}</div><div className="md:hidden"><Navbar role={session?.role} name={session?.name} /></div></body></html>;
}
