"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, LayoutDashboard, LogOut, Pill, Stethoscope, Users } from "lucide-react";

type NavbarProps = { role?: "PATIENT" | "DOCTOR" | "ADMIN"; name?: string };
const patientItems = [{ name: "หน้าหลัก", href: "/patient", icon: LayoutDashboard }, { name: "ตารางยา", href: "/schedule", icon: CalendarDays }, { name: "รายการยา", href: "/medications", icon: Pill }];
const doctorItems = [{ name: "แดชบอร์ด", href: "/doctor", icon: Stethoscope }, { name: "ผู้ป่วย", href: "/doctor#patients", icon: Users }];

export default function Navbar({ role, name }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  if (["/login", "/register", "/forgot-password"].includes(pathname)) return null;
  const isDoctor = role === "DOCTOR" || role === "ADMIN";
  const items = isDoctor ? doctorItems : patientItems;
  const activeClass = isDoctor ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-[#1769b0]";
  async function handleLogout() { await fetch("/api/auth/logout", { method: "POST" }); router.replace("/login"); router.refresh(); }
  return <nav className={`fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.06)] backdrop-blur md:relative md:border-t-0 md:border-b md:px-6 md:py-3 md:shadow-none ${isDoctor ? "border-emerald-100" : "border-slate-200/80"}`}><div className="mx-auto flex h-14 max-w-5xl items-center justify-around gap-1 md:justify-start md:gap-2">{isDoctor && <div className="mr-5 hidden items-center gap-2 border-r border-emerald-100 pr-5 md:flex"><div className="rounded-xl bg-emerald-50 p-2 text-emerald-700"><Stethoscope className="h-5 w-5" /></div><div><p className="text-xs font-semibold text-emerald-700">DOCTOR PORTAL</p><p className="max-w-28 truncate text-xs text-slate-500">{name || "แพทย์"}</p></div></div>}{items.map((item) => { const Icon = item.icon; const path = item.href.split("#")[0]; const isActive = pathname === path; return <Link key={item.href} href={item.href} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium transition md:flex-none md:flex-row md:px-4 md:text-sm ${isActive ? activeClass : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} /><span className="truncate">{item.name}</span></Link>; })}<button type="button" onClick={handleLogout} aria-label="ออกจากระบบ" className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 md:ml-auto md:flex-none md:flex-row md:px-4 md:text-sm"><LogOut className="h-5 w-5" /><span className="truncate">ออกจากระบบ</span></button></div></nav>;
}
