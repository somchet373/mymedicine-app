"use client";

import { useEffect } from "react";

export default function NotificationManager() {
  useEffect(() => {
    // 1. ตรวจสอบว่าเบราว์เซอร์รองรับระบบแจ้งเตือนไหม
    if (!("Notification" in window)) {
      console.log("เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน");
      return;
    }

    // 2. ขออนุญาตผู้ใช้ (ถ้ายังไม่เคยขอ)
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // 3. ตั้งเวลาเช็คทุกๆ 1 นาที (60,000 มิลลิวินาที)
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // สมมติฐาน: ระบบเช็คว่าถึงเวลา 08:00 น. (เวลามาตรฐานสำหรับกินยาตอนเช้า)
      // *ในระบบจริง เราจะเอาเวลาไปเทียบกับ Database ของผู้ป่วย
      if (hours === 8 && minutes === 0) {
        if (Notification.permission === "granted") {
          new Notification("💊 ถึงเวลากินยาแล้วครับ!", {
            body: "อย่าลืมรับประทานยาตามตาราง เพื่อสุขภาพที่ดีนะครับ",
            icon: "/favicon.ico", // รูปไอคอนที่จะโชว์ในการแจ้งเตือน
          });
        }
      }
    }, 60000);

    // 4. ลบการตั้งเวลาทิ้งเมื่อผู้ใช้ปิดหน้าเว็บ (Clean up)
    return () => clearInterval(interval);
  }, []);

  return null; // Component นี้ไม่จำเป็นต้องแสดงผลอะไรบนหน้าจอ
}