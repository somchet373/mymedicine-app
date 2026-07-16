"use client"; // ต้องใส่เพราะฟอร์มมีการโต้ตอบกับผู้ใช้ (Client-side)

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addMedication } from "@/actions/medication";
import { useRouter } from "next/navigation";

// 1. สร้าง Data Dictionary (Schema) ด้วย Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "ชื่อยาต้องมีอย่างน้อย 2 ตัวอักษร" }),
  remainingQuantity: z.number().min(1, { message: "ต้องมียาอย่างน้อย 1 เม็ด/ขวด" }),
  timesPerDay: z.number().min(1, { message: "ต้องกินอย่างน้อย 1 ครั้งต่อวัน" }),
});

export default function NewMedicationPage() {
  const router = useRouter();

  // 2. ตั้งค่า React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      remainingQuantity: 0,
      timesPerDay: 1,
    },
  });

  // 3. ฟังก์ชันจัดการเมื่อกด Submit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addMedication(values);
    
    if (result.success) {
      alert("บันทึกข้อมูลสำเร็จ!");
      router.push("/"); // เด้งกลับไปหน้า Home
    } else {
      alert("เกิดข้อผิดพลาด: " + result.error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-50">
      <div className="rounded-2xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-white">เพิ่มยาใหม่</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Field: ชื่อยา */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">ชื่อยา</FormLabel>
                  <FormControl>
                    <Input placeholder="เช่น พาราเซตามอล" className="bg-zinc-950 border-zinc-700" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Field: จำนวนคงเหลือ */}
            <FormField
              control={form.control}
              name="remainingQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">จำนวนคงเหลือ (เม็ด/แคปซูล)</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-zinc-950 border-zinc-700" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Field: จำนวนครั้งต่อวัน */}
            <FormField
              control={form.control}
              name="timesPerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">ความถี่ (ครั้งต่อวัน)</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-zinc-950 border-zinc-700" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200">
              บันทึกข้อมูล
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}