import Link from "next/link";
import { Plus, Stethoscope, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DoctorPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "DOCTOR" && session.role !== "ADMIN") redirect("/patient");
  const patients = await prisma.user.findMany({ where: { role: "PATIENT" }, orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, imageUrl: true, _count: { select: { medications: true } } } });
  return <main className="min-h-screen bg-[#f6f8fc] px-5 py-8 text-slate-900 sm:px-8"><div className="mx-auto max-w-5xl"><section className="rounded-[2rem] bg-gradient-to-br from-emerald-700 to-teal-600 p-7 text-white shadow-xl shadow-emerald-950/15 sm:p-10"><div className="flex items-start justify-between gap-5"><div><div className="mb-4 flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium"><Stethoscope className="h-3.5 w-3.5" />พื้นที่แพทย์</div><h1 className="text-3xl font-bold">สวัสดีคุณหมอ {session.name}</h1><p className="mt-2 text-sm text-emerald-50">เลือกผู้ป่วยเพื่อดูรายการยาและเพิ่มยาให้ผู้ป่วย</p></div><div className="rounded-2xl bg-white/15 p-3"><Users className="h-7 w-7" /></div></div></section><header className="mt-8 flex items-end justify-between"><div><p className="text-sm font-semibold text-emerald-700">รายชื่อผู้ป่วย</p><h2 className="mt-1 text-2xl font-bold">ผู้ป่วยทั้งหมด ({patients.length})</h2></div></header><section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{patients.map((patient) => <article key={patient.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 font-bold text-emerald-700">{patient.name.slice(0, 1)}</div><h3 className="mt-4 font-semibold text-slate-900">{patient.name}</h3><p className="mt-1 truncate text-sm text-slate-500">{patient.email}</p><p className="mt-3 text-sm text-slate-500">มียา {patient._count.medications} รายการ</p><Link href={`/medications/new?patientId=${patient.id}`} className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"><Plus className="h-4 w-4" />เพิ่มยาให้ผู้ป่วย</Link></article>)}{patients.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-emerald-200 bg-white p-10 text-center text-sm text-slate-500">ยังไม่มีผู้ป่วยลงทะเบียนในระบบ</div>}</section></div></main>;
}
