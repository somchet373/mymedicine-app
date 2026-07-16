"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeartPulse } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.get("email"), password: formData.get("password"), remember: formData.get("remember") === "on" }) });
      const payload: { error?: string } | null = await response.json().catch(() => null);
      if (!response.ok) return setError(payload?.error || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      router.push("/");
      router.refresh();
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return <main className="grid min-h-screen place-items-center bg-[#f6f8fc] p-5 text-slate-900"><form action={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60"><div className="mb-7 text-center"><HeartPulse className="mx-auto h-10 w-10 text-[#1769b0]" /><h1 className="mt-3 text-2xl font-bold">ยินดีต้อนรับกลับ</h1><p className="mt-1 text-sm text-slate-500">เข้าสู่ระบบเพื่อดูแลสุขภาพของคุณ</p></div>{error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<label className="block text-sm font-medium text-slate-700">อีเมล<input required name="email" type="email" className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-900 outline-none focus:border-blue-500" /></label><label className="mt-4 block text-sm font-medium text-slate-700">รหัสผ่าน<input required name="password" type="password" className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-900 outline-none focus:border-blue-500" /></label><div className="mt-4 flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-slate-600"><input name="remember" type="checkbox" /> จดจำฉัน</label><Link href="/forgot-password" className="font-medium text-[#1769b0]">ลืมรหัสผ่าน?</Link></div><button disabled={loading} className="mt-6 h-11 w-full rounded-xl bg-[#1769b0] font-semibold text-white hover:bg-[#105993] disabled:opacity-60">{loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}</button><p className="mt-5 text-center text-sm text-slate-500">ยังไม่มีบัญชี? <Link href="/register" className="font-semibold text-[#1769b0]">สมัครใช้งาน</Link></p></form></main>;
}
