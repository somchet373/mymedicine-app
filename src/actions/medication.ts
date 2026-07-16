"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/auth";

const medicationInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  remainingQuantity: z.number().int().min(1),
  timesPerDay: z.number().int().min(1).max(24),
});

// 1. ฟังก์ชันดึงรายการยาทั้งหมด
export async function getMedications() {
  try {
    const session = await getSession();
    if (!session) return [];
    // ใช้ Prisma ดึงข้อมูลยา เรียงจากวันที่สร้างล่าสุด (desc)
    const medications = await prisma.medication.findMany({
      where: { userId: session.userId },
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
    const session = await getSession();
    if (!session) return { totalMedications: 0, lowStockMeds: 0 };
    const totalMedications = await prisma.medication.count({ where: { userId: session.userId } });

    // ดึงเฉพาะยาที่จำนวนคงเหลือน้อยกว่า 10 เพื่อเตือน
    const lowStockMeds = await prisma.medication.count({
      where: {
        userId: session.userId,
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
export async function addMedication(formData: z.infer<typeof medicationInputSchema>, patientId?: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "กรุณาเข้าสู่ระบบก่อนเพิ่มยา" };
    if (session.role !== "DOCTOR") return { success: false, error: "เฉพาะแพทย์เท่านั้นที่สามารถเพิ่มยาได้" };
    const validatedData = medicationInputSchema.safeParse(formData);
    if (!validatedData.success) {
      return { success: false, error: "ข้อมูลยาไม่ถูกต้อง" };
    }

    const targetPatientId = patientId || session.userId;
    const patient = await prisma.user.findFirst({ where: { id: targetPatientId, role: "PATIENT" }, select: { id: true } });
    if (!patient) return { success: false, error: "ไม่พบข้อมูลผู้ป่วยที่เลือก" };

    const newMedication = await prisma.medication.create({
      data: {
        userId: patient.id,
        name: validatedData.data.name,
        remainingQuantity: validatedData.data.remainingQuantity,
        timesPerDay: validatedData.data.timesPerDay,
        startDate: new Date(), // เบื้องต้นกำหนดให้เป็นวันที่เพิ่มยาเลย
      },
    });

    // สั่งให้ Next.js ล้างแคชหน้า Home ข้อมูลจะได้อัปเดตทันที
    revalidatePath("/");
    revalidatePath("/medications");
    revalidatePath("/schedule");

    return { success: true, data: newMedication };
  } catch (error) {
    console.error("Add Medication Error:", error);
    return { success: false, error: "ไม่สามารถเพิ่มข้อมูลยาได้" };
  }
}

// (โค้ดเดิมด้านบน...)

// 4. ฟังก์ชันลบยา
export async function deleteMedication(id: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "กรุณาเข้าสู่ระบบก่อนลบยา" };
    if (!id) {
      return { success: false, error: "ไม่พบรายการยาที่ต้องการลบ" };
    }

    const deleted = await prisma.medication.deleteMany({ where: { id, userId: session.userId } });
    if (deleted.count !== 1) return { success: false, error: "ไม่พบรายการยา หรือคุณไม่มีสิทธิ์ลบรายการนี้" };

    // ล้างแคชเพื่อให้หน้าเว็บอัปเดตข้อมูลใหม่ทันที
    revalidatePath("/");
    revalidatePath("/medications");
    revalidatePath("/schedule");
    
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "ไม่สามารถลบข้อมูลได้" };
  }
}
