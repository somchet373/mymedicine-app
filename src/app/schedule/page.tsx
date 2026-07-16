import { format } from "date-fns";
import { th } from "date-fns/locale";
import { CheckCircle2, Clock3, Pill } from "lucide-react";
import { getMedications } from "@/actions/medication";
import { getTakenMedicationIdsForToday } from "@/actions/history";
import TakeMedicationButton from "@/components/TakeMedicationButton";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "DOCTOR" || session.role === "ADMIN") redirect("/doctor");
  const [medications, takenMedicationIds] = await Promise.all([getMedications(), getTakenMedicationIdsForToday()]);
  const takenMedicationIdSet = new Set(takenMedicationIds);
  const takenCount = medications.filter((medication) => takenMedicationIdSet.has(medication.id)).length;
  const today = format(new Date(), "EEEEที่ d MMMM yyyy", { locale: th });
  return <main className="min-h-screen bg-[#f6f8fc] px-5 py-8 text-slate-900 sm:px-8"><div className="mx-auto max-w-4xl"><header className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="flex items-center gap-2 text-sm font-semibold text-[#1769b0]"><Clock3 className="h-4 w-4" />ตารางประจำวัน</p><h1 className="mt-2 text-3xl font-bold tracking-tight">ยาที่ต้องรับประทาน</h1><p className="mt-2 text-sm text-slate-500">{today}</p></div><div className="rounded-2xl bg-blue-50 px-4 py-3 text-right"><p className="text-xs font-medium text-slate-500">ดำเนินการแล้ว</p><p className="mt-1 text-xl font-bold text-[#1769b0]">{takenCount}/{medications.length}</p></div></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-[#1769b0] to-cyan-500 transition-all" style={{ width: `${medications.length ? (takenCount / medications.length) * 100 : 0}%` }} /></div></header><section className="mt-6 space-y-3">{medications.length === 0 ? <div className="rounded-3xl border border-dashed border-blue-200 bg-white px-6 py-14 text-center"><Pill className="mx-auto h-9 w-9 text-blue-300" /><h2 className="mt-4 font-semibold">ยังไม่มีรายการในตาราง</h2><p className="mt-2 text-sm text-slate-500">เพิ่มยาเพื่อเริ่มวางแผนการรับประทาน</p></div> : medications.map((med) => { const isTaken = takenMedicationIdSet.has(med.id); return <article key={med.id} className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition sm:flex-row sm:items-center sm:justify-between ${isTaken ? "border-emerald-100" : "border-slate-200"}`}><div className="flex items-center gap-4"><div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isTaken ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-[#1769b0]"}`}>{isTaken ? <CheckCircle2 className="h-6 w-6" /> : <Pill className="h-6 w-6" />}</div><div><h2 className={`font-semibold ${isTaken ? "text-emerald-800" : "text-slate-800"}`}>{med.name}</h2><p className="mt-1 text-sm text-slate-500">วันละ {med.timesPerDay} ครั้ง · คงเหลือ {med.remainingQuantity} เม็ด</p></div></div><TakeMedicationButton medicationId={med.id} isTaken={isTaken} /></article>; })}</section></div></main>;
}
