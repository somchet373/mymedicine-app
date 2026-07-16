"use client";

import { Button } from "@/components/ui/button";
import { BellRing } from "lucide-react";

export default function TestNotification() {
  const handleTest = () => {
    if (Notification.permission === "granted") {
      new Notification("ทดสอบระบบ", {
        body: "นี่คือตัวอย่างข้อความแจ้งเตือนกินยาของคุณ!",
      });
    } else {
      alert("กรุณาอนุญาตการแจ้งเตือนในเบราว์เซอร์ก่อนครับ");
      Notification.requestPermission();
    }
  };

  return (
    <Button 
      onClick={handleTest} 
      variant="outline" 
      className="w-full bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
    >
      <BellRing className="w-4 h-4 mr-2" />
      ทดสอบเด้งแจ้งเตือน
    </Button>
  );
}