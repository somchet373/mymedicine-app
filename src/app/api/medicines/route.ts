import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const createSchema = z.object({ patientId: z.string().cuid(), name: z.string().trim().min(2).max(120), dosage: z.string().max(50).optional(), type: z.string().max(50).optional(), remainingQuantity: z.number().int().min(0), lowStockThreshold: z.number().int().min(0).default(10), timesPerDay: z.number().int().min(1).max(24), mealTiming: z.enum(["BEFORE_MEAL", "AFTER_MEAL", "WITH_MEAL", "OTHER"]).default("AFTER_MEAL"), notes: z.string().max(1000).optional(), color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#1769B0") });

export async function GET(request: Request) {
  const session = await getSession(); if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url); const q = searchParams.get("q")?.trim(); const page = Math.max(1, Number(searchParams.get("page") || 1)); const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 12)));
  const where = { userId: session.userId, ...(q ? { name: { contains: q } } : {}) };
  const [items, total] = await prisma.$transaction([prisma.medication.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit, include: { schedules: true } }), prisma.medication.count({ where })]);
  return NextResponse.json({ data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function POST(request: Request) {
  const session = await getSession(); if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "DOCTOR") return NextResponse.json({ error: "Only doctors can create medicines" }, { status: 403 });
  const parsed = createSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  const { patientId, ...medicineData } = parsed.data;
  const patient = await prisma.user.findFirst({ where: { id: patientId, role: "PATIENT" }, select: { id: true } });
  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  const medicine = await prisma.medication.create({ data: { ...medicineData, userId: patient.id, startDate: new Date() } });
  await prisma.auditLog.create({ data: { userId: session.userId, action: "CREATE", entity: "Medication", entityId: medicine.id } });
  return NextResponse.json({ data: medicine }, { status: 201 });
}
