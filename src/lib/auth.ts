import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

export type Session = { userId: string; email: string; name: string; role: "PATIENT" | "DOCTOR" | "ADMIN" };
const accessCookie = "mm_access";
const refreshCookie = "mm_refresh";
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || "development-only-change-me-before-production");
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

async function sign(payload: Session, expiresIn: string) {
  return new SignJWT({ email: payload.email, name: payload.name, role: payload.role })
    .setProtectedHeader({ alg: "HS256" }).setSubject(payload.userId).setIssuedAt().setExpirationTime(expiresIn).sign(secret());
}

export async function createSession(session: Session, remember = false) {
  const accessToken = await sign(session, "15m");
  const refreshToken = await sign(session, remember ? "30d" : "7d");
  const expiryDays = remember ? 30 : 7;
  await prisma.refreshToken.create({ data: { userId: session.userId, tokenHash: hash(refreshToken), expiresAt: new Date(Date.now() + expiryDays * 86400000) } });
  const store = await cookies();
  const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
  store.set(accessCookie, accessToken, { ...cookieOptions, maxAge: 900 });
  store.set(refreshCookie, refreshToken, { ...cookieOptions, maxAge: expiryDays * 86400 });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(accessCookie)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || typeof payload.email !== "string" || typeof payload.name !== "string" || !["PATIENT", "DOCTOR", "ADMIN"].includes(String(payload.role))) return null;
    return { userId: payload.sub, email: payload.email, name: payload.name, role: payload.role as Session["role"] };
  } catch { return null; }
}

export async function clearSession() {
  const store = await cookies();
  const refreshToken = store.get(refreshCookie)?.value;
  if (refreshToken) {
    try { await prisma.refreshToken.deleteMany({ where: { tokenHash: hash(refreshToken) } }); } catch (error) { console.error("Refresh-token cleanup failed:", error); }
  }
  store.delete(accessCookie);
  store.delete(refreshCookie);
}
export async function requireRole(...roles: Session["role"][]) { const session = await getSession(); return session && roles.includes(session.role) ? session : null; }
