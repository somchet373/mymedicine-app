"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { markAsTaken } from "@/actions/history";
import { useTransition, useState } from "react";
import { Label } from "@/components/ui/label";

export default function TakeMedicationButton({ medicationId }: { medicationId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isChecked, setIsChecked] = useState(false);

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
    <div className="flex items-center space-x-2 bg-zinc-800 p-3 rounded-lg border border-zinc-700">
      <Checkbox 
        id={`med-${medicationId}`} 
        checked={isChecked}
        onCheckedChange={handleCheck}
        disabled={isPending || isChecked} // ถ้ากดแล้วให้ปิดปุ่มไปเลย
        className="border-zinc-500 data-[state=checked]:bg-white data-[state=checked]:text-black"
      />
      <Label 
        htmlFor={`med-${medicationId}`} 
        className={`text-sm font-medium ${isChecked ? "text-zinc-500 line-through" : "text-zinc-200"}`}
      >
        {isChecked ? "กินยาเรียบร้อยแล้ว" : "ทำเครื่องหมายว่ากินแล้ว"}
      </Label>
    </div>
  );
}