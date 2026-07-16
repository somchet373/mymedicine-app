"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { addMedication } from "@/actions/medication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const schema = z.object({ name: z.string().trim().min(2, "กรุณาระบุชื่อยา"), remainingQuantity: z.number().int().min(1, "จำนวนยาต้องอย่างน้อย 1"), timesPerDay: z.number().int().min(1).max(24) });

export default function MedicationForm({ patientId, patientName }: { patientId: string; patientName: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: "", remainingQuantity: 1, timesPerDay: 1 } });
  async function onSubmit(values: z.infer<typeof schema>) { const result = await addMedication(values, patientId); if (!result.success) return form.setError("root", { message: result.error }); router.push("/doctor"); router.refresh(); }
  return <main className="min-h-screen bg-[#f6f8fc] px-5 py-8 text-slate-900 sm:px-8"><div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-sm font-semibold text-emerald-700">ระบบสำหรับแพทย์</p><h1 className="mt-1 text-3xl font-bold">เพิ่มยาใหม่</h1><p className="mt-2 mb-7 text-sm text-slate-500">เพิ่มยาให้ผู้ป่วย: <span className="font-semibold text-slate-700">{patientName}</span></p><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">{form.formState.errors.root && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{form.formState.errors.root.message}</p>}<FormField control={form.control} name="name" render={({ field }) => <FormItem><FormLabel>ชื่อยา</FormLabel><FormControl><Input {...field} placeholder="เช่น Paracetamol" className="h-11 rounded-xl border-slate-200 bg-slate-50" /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="remainingQuantity" render={({ field }) => <FormItem><FormLabel>จำนวนคงเหลือ</FormLabel><FormControl><Input {...field} type="number" min={1} className="h-11 rounded-xl border-slate-200 bg-slate-50" onChange={(event) => field.onChange(event.target.valueAsNumber)} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="timesPerDay" render={({ field }) => <FormItem><FormLabel>ความถี่ (ครั้งต่อวัน)</FormLabel><FormControl><Input {...field} type="number" min={1} max={24} className="h-11 rounded-xl border-slate-200 bg-slate-50" onChange={(event) => field.onChange(event.target.valueAsNumber)} /></FormControl><FormMessage /></FormItem>} /><Button type="submit" disabled={form.formState.isSubmitting} className="h-11 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">{form.formState.isSubmitting ? "กำลังบันทึก..." : "บันทึกยาให้ผู้ป่วย"}</Button></form></Form></div></main>;
}
