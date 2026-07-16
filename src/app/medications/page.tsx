import { getMedications } from "@/actions/medication";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";
import DeleteButton from "@/components/DeleteButton"; // Import ปุ่มที่เราเพิ่งสร้าง
import Link from "next/link";
import { Button } from "@/components/ui/button";

// This page reads from Prisma and must not be evaluated during `next build`.
export const dynamic = "force-dynamic";

export default async function MedicationsPage() {
  // ดึงข้อมูลยาทั้งหมดจาก Database
  const medications = await getMedications();

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-zinc-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">รายการยาของฉัน</h1>
          <Link href="/medications/new">
            <Button className="bg-white text-black hover:bg-zinc-200">
              + เพิ่มยาใหม่
            </Button>
          </Link>
        </div>

        {/* ถ้าไม่มียา ให้แสดง Empty State */}
        {medications.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 rounded-2xl border border-zinc-800">
            <Pill className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <p className="text-zinc-400">ยังไม่มีข้อมูลยาในระบบ</p>
          </div>
        ) : (
          /* ถ้ายามีข้อมูล ให้แสดงเป็น Grid (ตาราง) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.map((med) => (
              <Card key={med.id} className="bg-zinc-900 border-zinc-800 text-zinc-100">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-xl font-bold">{med.name}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      กินวันละ {med.timesPerDay} ครั้ง
                    </CardDescription>
                  </div>
                  {/* เรียกใช้ปุ่มลบ และส่ง id ไปให้ */}
                  <DeleteButton id={med.id} />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-zinc-300 mt-4 flex items-center justify-between">
                    <span>คงเหลือ:</span>
                    <span className="font-bold text-lg bg-zinc-800 px-3 py-1 rounded-md">
                      {med.remainingQuantity}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
