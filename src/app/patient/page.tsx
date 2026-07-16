import Link from "next/link";
import { Activity, ArrowRight, CircleAlert, Pill } from "lucide-react";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/actions/medication";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PatientPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "DOCTOR" || session.role === "ADMIN") redirect("/doctor");
  const stats = await getDashboardStats();
  return <main className="min-h-screen bg-[#f6f8fc] px-5 py-8 text-slate-900 sm:px-8"><div className="mx-auto max-w-5xl"><section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0f3d78] via-[#1559a6] to-[#2187b8] px-6 py-8 text-white shadow-xl shadow-blue-950/15 sm:px-10 sm:py-10"><div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-2xl" /><div className="relative max-w-xl"><div className="mb-5 flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium"><Activity className="h-3.5 w-3.5" />พื้นที่ผู้ป่วย</div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">สวัสดีคุณ {session.name}</h1><p className="mt-3 text-sm leading-6 text-blue-50 sm:text-base">ติดตามยาและยืนยันการรับประทานตามตารางของคุณ</p><Link href="/schedule" className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#13549d] shadow-sm transition hover:bg-blue-50">ดูตารางวันนี้ <ArrowRight className="h-4 w-4" /></Link></div></section><section className="mt-7 grid gap-4 sm:grid-cols-2"><article className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">ยาของฉัน</p><p className="mt-2 text-4xl font-bold text-slate-900">{stats.totalMedications}</p><Link href="/medications" className="mt-3 inline-block text-sm font-semibold text-[#1769b0]">ดูรายการยา</Link></div><div className="rounded-2xl bg-blue-50 p-3 text-[#1769b0]"><Pill className="h-6 w-6" /></div></div></article><article className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">ยาใกล้หมด</p><p className="mt-2 text-4xl font-bold text-amber-600">{stats.lowStockMeds}</p><p className="mt-3 text-sm text-slate-500">กรุณาแจ้งแพทย์เมื่อยาใกล้หมด</p></div><div className="rounded-2xl bg-amber-50 p-3 text-amber-600"><CircleAlert className="h-6 w-6" /></div></div></article></section></div></main>;
}
