"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { markAsTaken } from "@/actions/history";
import { useTransition, useState } from "react";
import { Label } from "@/components/ui/label";

export default function TakeMedicationButton({ medicationId, isTaken = false }: { medicationId: string; isTaken?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [isChecked, setIsChecked] = useState(isTaken);

  const handleCheck = (checked: boolean) => {
    if (checked) {
      setIsChecked(true);
      startTransition(async () => {
        const result = await markAsTaken(medicationId);
        if (!result.success) {
          alert(result.error);
          setIsChecked(false); // ถ้าระบบพัง ให้ติ๊กออก
        }
      });
    }
  };

  return (
    <div className={`flex items-center space-x-2 rounded-xl border p-3 ${isChecked ? "border-emerald-200 bg-emerald-50" : "border-blue-100 bg-blue-50"}`}>
      <Checkbox 
        id={`med-${medicationId}`} 
        checked={isChecked}
        onCheckedChange={handleCheck}
        disabled={isPending || isChecked} // ถ้ากดแล้วให้ปิดปุ่มไปเลย
        className="border-blue-400 data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600"
      />
      <Label 
        htmlFor={`med-${medicationId}`} 
        className={`text-sm font-medium ${isChecked ? "text-emerald-700 line-through" : "text-[#1769b0]"}`}
      >
        {isChecked ? "กินยาเรียบร้อยแล้ว" : "ทำเครื่องหมายว่ากินแล้ว"}
      </Label>
    </div>
  );
}
