import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().email(), password: z.string().min(8).max(72), role: z.enum(["PATIENT", "DOCTOR"]).default("PATIENT"), remember: z.boolean().optional() });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "ข้อมูลสมัครสมาชิกไม่ถูกต้อง" }, { status: 400 });
    const { name, email, password, role, remember } = parsed.data;
    if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 409 });
    const user = await prisma.user.create({ data: { name, email, role, passwordHash: await bcrypt.hash(password, 12) } });
    await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role }, remember);
    return NextResponse.json({ data: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "ไม่สามารถสมัครสมาชิกได้ กรุณาตรวจสอบการเชื่อมต่อฐานข้อมูล" }, { status: 500 });
  }
}
