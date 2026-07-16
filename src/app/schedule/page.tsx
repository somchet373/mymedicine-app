import { getMedications } from "@/actions/medication";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import TakeMedicationButton from "@/components/TakeMedicationButton";

// This page reads from Prisma and must not be evaluated during `next build`.
export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const medications = await getMedications();
  
  // ใช้ date-fns จัดฟอร์แมตวันที่ให้สวยงามเป็นภาษาไทย
  const today = format(new Date(), "EEEEที่ d MMMM yyyy", { locale: th });

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-zinc-50">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ตารางการกินยาวันนี้</h1>
          <p className="text-zinc-400 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {today}
          </p>
        </header>

        <div className="space-y-4">
          {medications.length === 0 ? (
            <div className="text-center py-10 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400">
              ไม่มีคิวกินยาวันนี้
            </div>
          ) : (
            medications.map((med) => (
              <Card key={med.id} className="bg-zinc-900 border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl text-zinc-100">{med.name}</CardTitle>
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                      วันละ {med.timesPerDay} ครั้ง
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: med.color }}></span>
                    คงเหลือ {med.remainingQuantity} เม็ด
                  </p>
                </div>

                {/* ปุ่มกดยืนยันการกินยา */}
                <div className="w-full sm:w-auto">
                  <TakeMedicationButton medicationId={med.id} />
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
