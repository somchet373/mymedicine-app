import { Button } from "@/components/ui/button";
import { Pill } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-24 text-zinc-50">
      <div className="rounded-2xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-white">
          MyMedicine
        </h1>
        <p className="text-zinc-400 text-lg mb-8">
          ระบบช่วยจัดการการรับประทานยาและแจ้งเตือนเวอร์ชันแรก
        </p>
        
        {/* ทดลองใช้งาน Button และ Icon */}
        <Button className="w-full text-md h-12 bg-white text-black hover:bg-zinc-200">
          <Pill className="mr-2 h-5 w-5" />
          เริ่มต้นใช้งาน
        </Button>
      </div>
    </main>
  );
}