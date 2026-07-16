"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. ฟังก์ชันดึงรายการยาทั้งหมด
export async function getMedications() {
  try {
    // ใช้ Prisma ดึงข้อมูลยา เรียงจากวันที่สร้างล่าสุด (desc)
    const medications = await prisma.medication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return medications;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("ไม่สามารถดึงข้อมูลยาได้");
  }
}

// 2. ฟังก์ชันดึงสถิติสำหรับหน้า Dashboard (Home)
export async function getDashboardStats() {
  try {
    const totalMedications = await prisma.medication.count();

    // ดึงเฉพาะยาที่จำนวนคงเหลือน้อยกว่า 10 เพื่อเตือน
    const lowStockMeds = await prisma.medication.count({
      where: {
        remainingQuantity: {
          lt: 10,
        },
      },
    });

    return {
      totalMedications,
      lowStockMeds,
      // เดี๋ยวเราค่อยมาเพิ่มสถิติการกินยาของ "วันนี้" ตอนทำระบบ Schedule ครบ
    };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    throw new Error("ไม่สามารถดึงข้อมูลสถิติได้");
  }
}

// (โค้ดเดิมด้านบน...)

// 3. ฟังก์ชันเพิ่มยาใหม่
export async function addMedication(formData: {
  name: string;
  remainingQuantity: number;
  timesPerDay: number;
}) {
  try {
    const newMedication = await prisma.medication.create({
      data: {
        name: formData.name,
        remainingQuantity: formData.remainingQuantity,
        timesPerDay: formData.timesPerDay,
        startDate: new Date(), // เบื้องต้นกำหนดให้เป็นวันที่เพิ่มยาเลย
      },
    });

    // สั่งให้ Next.js ล้างแคชหน้า Home ข้อมูลจะได้อัปเดตทันที
    revalidatePath("/");

    return { success: true, data: newMedication };
  } catch (error) {
    console.error("Add Medication Error:", error);
    return { success: false, error: "ไม่สามารถเพิ่มข้อมูลยาได้" };
  }
}
