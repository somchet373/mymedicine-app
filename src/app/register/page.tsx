"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(data: FormData) {
    setError("");
    const password = String(data.get("password"));
    if (password !== data.get("confirmPassword")) return setError("รหัสผ่านไม่ตรงกัน");

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), email: data.get("email"), password, role: data.get("role"), remember: true }),
      });
      const payload: { error?: string } | null = await response.json().catch(() => null);
      if (!response.ok) return setError(payload?.error || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      router.push("/");
      router.refresh();
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบได้ กรุณาตรวจสอบอินเทอร์เน็ตและฐานข้อมูล");
    } finally {
      setLoading(false);
    }
  }

  return <main className="grid min-h-screen place-items-center bg-[#f6f8fc] p-5 text-slate-900"><form action={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60"><h1 className="text-2xl font-bold">สร้างบัญชีผู้ใช้</h1><p className="mt-1 text-sm text-slate-500">เลือกบทบาทผู้ป่วยหรือแพทย์เพื่อเริ่มใช้งาน</p>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<label className="mt-5 block text-sm font-medium text-slate-700">บทบาท<select name="role" className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900"><option value="PATIENT">ผู้ป่วย</option><option value="DOCTOR">แพทย์</option></select></label><label className="mt-4 block text-sm font-medium text-slate-700">ชื่อที่แสดง<input required name="name" minLength={2} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-900" /></label><label className="mt-4 block text-sm font-medium text-slate-700">อีเมล<input required name="email" type="email" className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-900" /></label><label className="mt-4 block text-sm font-medium text-slate-700">รหัสผ่าน<input required name="password" type="password" minLength={8} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-900" /></label><label className="mt-4 block text-sm font-medium text-slate-700">ยืนยันรหัสผ่าน<input required name="confirmPassword" type="password" minLength={8} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-900" /></label><button disabled={loading} className="mt-6 h-11 w-full rounded-xl bg-[#1769b0] font-semibold text-white hover:bg-[#105993] disabled:opacity-60">{loading ? "กำลังสมัคร..." : "สมัครใช้งาน"}</button><p className="mt-5 text-center text-sm text-slate-500">มีบัญชีอยู่แล้ว? <Link href="/login" className="font-semibold text-[#1769b0]">เข้าสู่ระบบ</Link></p></form></main>;
}
