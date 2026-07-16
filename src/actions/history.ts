"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAsTaken(medicationId: string) {
  try {
    // ใช้ Prisma Transaction เพื่อรับประกันว่าข้อมูลจะถูกอัปเดตพร้อมกันทั้ง 2 ตาราง
    await prisma.$transaction(async (tx) => {
      // 1. บันทึกประวัติว่ากินแล้ว
      await tx.history.create({
        data: {
          medicationId: medicationId,
          date: new Date(),
          isTaken: true,
          timeTaken: new Date().toLocaleTimeString('th-TH'), // เก็บเวลาที่กด
        },
      });

      // 2. ตัดยอดจำนวนยาคงเหลือลง 1
      await tx.medication.update({
        where: { id: medicationId },
        data: {
          remainingQuantity: {
            decrement: 1, // คำสั่งพิเศษของ Prisma สำหรับลบเลข
          },
        },
      });
    });

    // รีเฟรชหน้าเว็บเพื่อให้ตัวเลขและสถานะอัปเดต
    revalidatePath("/schedule");
    revalidatePath("/medications");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Mark as taken error:", error);
    return { success: false, error: "ไม่สามารถบันทึกข้อมูลได้" };
  }
}