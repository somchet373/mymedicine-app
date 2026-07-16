import { getMedications } from "@/actions/medication";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, AlertCircle } from "lucide-react";

// ใน Next.js 15 searchParams ต้องถูกรับเป็น Promise
// This page reads from Prisma and must not be evaluated during `next build`.
export const dynamic = "force-dynamic";

export default async function FamilyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const sharedId = params.id; // ดึงค่าจาก ?id=...

  // ในระบบจริง เราอาจจะใช้ sharedId ไปค้นหาข้อมูล User แต่ตอนนี้ MVP เราจะดึงยาทั้งหมดมาแสดง
  const medications = await getMedications();

  if (!sharedId) {
    return (
      <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">ลิงก์ไม่ถูกต้อง</h1>
        <p className="text-zinc-400">กรุณาตรวจสอบลิงก์ที่ได้รับจากผู้ป่วยอีกครั้ง</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-zinc-50">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <HeartPulse className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">ข้อมูลสุขภาพของผู้ป่วย</h1>
          <p className="text-zinc-400">
            คุณกำลังดูข้อมูลการรับประทานยาในฐานะญาติ (รหัสอ้างอิง: {sharedId})
          </p>
        </header>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-200 mb-4">ยาที่ต้องรับประทาน</h2>
          {medications.length === 0 ? (
            <p className="text-zinc-500 text-center py-10">ยังไม่มีข้อมูลยา</p>
          ) : (
            medications.map((med) => (
              <Card key={med.id} className="bg-zinc-900 border-zinc-800 opacity-90">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-zinc-100 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: med.color }}></span>
                    {med.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>ความถี่: วันละ {med.timesPerDay} ครั้ง</span>
                    <span>คงเหลือ: {med.remainingQuantity} เม็ด</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
