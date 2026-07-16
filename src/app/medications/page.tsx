import { Pill, Package, Repeat2 } from "lucide-react";
import { getMedications } from "@/actions/medication";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteButton from "@/components/DeleteButton";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MedicationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "DOCTOR" || session.role === "ADMIN") redirect("/doctor");
  const medications = await getMedications();
  return (
    <main className="min-h-screen bg-[#f6f8fc] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold text-[#1769b0]">รายการที่ดูแลอยู่</p><h1 className="mt-1 text-3xl font-bold tracking-tight">ยาของฉัน</h1><p className="mt-2 text-sm text-slate-500">จัดการข้อมูลยาและตรวจสอบจำนวนคงเหลือ</p></div>
        </header>

        {medications.length === 0 ? (
          <section className="mt-8 rounded-3xl border border-dashed border-blue-200 bg-white px-6 py-16 text-center shadow-sm"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#1769b0]"><Pill className="h-8 w-8" /></div><h2 className="mt-5 text-xl font-semibold">ยังไม่มีรายการยา</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">แพทย์จะเป็นผู้เพิ่มรายการยาและตารางการรับประทานให้คุณ</p></section>
        ) : (
          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {medications.map((med) => {
              const lowStock = med.remainingQuantity < 10;
              return <Card key={med.id} className="border border-slate-200 bg-white py-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><CardHeader className="px-5 pb-3 pt-5"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><span className="mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ring-slate-100" style={{ backgroundColor: med.color }} /><div><CardTitle className="truncate text-lg font-semibold text-slate-800">{med.name}</CardTitle><CardDescription className="mt-1 text-slate-500">รับประทานวันละ {med.timesPerDay} ครั้ง</CardDescription></div></div><DeleteButton id={med.id} /></div></CardHeader><CardContent className="border-t border-slate-100 px-5 py-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-slate-500"><Package className="h-4 w-4 text-slate-400" />คงเหลือ</div><span className={`rounded-full px-3 py-1 text-sm font-semibold ${lowStock ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{med.remainingQuantity} เม็ด</span></div>{lowStock && <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-700"><Repeat2 className="h-3.5 w-3.5" />ใกล้หมด ควรเตรียมยาเพิ่ม</p>}</CardContent></Card>;
            })}
          </section>
        )}
      </div>
    </main>
  );
}
