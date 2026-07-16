"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function getTakenMedicationIdsForToday() {
  const session = await getSession();
  if (!session) return [];
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfDay);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const histories = await prisma.history.findMany({
    where: {
      medication: { userId: session.userId },
      isTaken: true,
      date: {
        gte: startOfDay,
        lt: startOfTomorrow,
      },
    },
    select: { medicationId: true },
    distinct: ["medicationId"],
  });

  return histories.map((history) => history.medicationId);
}

export async function markAsTaken(medicationId: string) {
  if (!medicationId) {
    return { success: false, error: "ไม่พบรายการยาที่ต้องการบันทึก" };
  }

  try {
    const session = await getSession();
    if (!session) return { success: false, error: "กรุณาเข้าสู่ระบบก่อนบันทึกการกินยา" };
    await prisma.$transaction(async (tx) => {
      // The condition and decrement happen together, preventing negative stock
      // when two requests attempt to record the same last dose.
      const updateResult = await tx.medication.updateMany({
        where: {
          id: medicationId,
          userId: session.userId,
          remainingQuantity: { gt: 0 },
        },
        data: {
          remainingQuantity: { decrement: 1 },
        },
      });

      if (updateResult.count !== 1) {
        throw new Error("Medication is unavailable");
      }

      await tx.history.create({
        data: {
          medicationId,
          date: new Date(),
          isTaken: true,
          timeTaken: new Date().toLocaleTimeString("th-TH"),
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/medications");
    revalidatePath("/schedule");

    return { success: true };
  } catch (error) {
    console.error("Mark as taken error:", error);
    return { success: false, error: "ไม่สามารถบันทึกการกินยาได้ ยาอาจหมดหรือถูกลบไปแล้ว" };
  }
}
