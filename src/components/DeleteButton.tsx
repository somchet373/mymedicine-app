"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteMedication } from "@/actions/medication";
import { useTransition } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    // ให้ยืนยันก่อนลบ (กันยูสเซอร์กดพลาด)
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบยานี้?")) {
      startTransition(async () => {
        const result = await deleteMedication(id);
        if (!result.success) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="icon" 
      onClick={handleDelete}
      disabled={isPending} // ปิดปุ่มตอนกำลังโหลด
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}