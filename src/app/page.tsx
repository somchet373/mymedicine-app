import { Button } from "@/components/ui/button";
import { Pill, AlertTriangle } from "lucide-react";
import { getDashboardStats } from "@/actions/medication"; // Import ฟังก์ชันที่เราเพิ่งสร้าง
import TestNotification from "@/components/TestNotification"; // นำเข้าคอมโพเนนต์ทดสอบแจ้งเตือน

// This page reads from Prisma and must not be evaluated during `next build`.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // เรียกใช้งาน Server Action ตรงๆ แบบไม่ต้องใช้ fetch()!
  const stats = await getDashboardStats();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-50">
      <div className="rounded-2xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-white">
          MyMedicine
        </h1>
        
        {/* กล่องแสดงสถิติ */}
        <TestNotification />
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
            <h2 className="text-3xl font-bold text-zinc-100">{stats.totalMedications}</h2>
            <p className="text-sm text-zinc-400">ยาทั้งหมด</p>
          </div>
          <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
            <h2 className="text-3xl font-bold text-red-400">{stats.lowStockMeds}</h2>
            <p className="text-sm text-zinc-400">ยาใกล้หมด</p>
          </div>
        </div>

        <Button className="w-full text-md h-12 bg-white text-black hover:bg-zinc-200">
          <Pill className="mr-2 h-5 w-5" />
          จัดการยาของฉัน
        </Button>
      </div>
    </main>
  );
}
