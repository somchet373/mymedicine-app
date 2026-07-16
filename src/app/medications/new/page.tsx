import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MedicationForm from "@/components/MedicationForm";

export const dynamic = "force-dynamic";

export default async function NewMedicationPage({ searchParams }: { searchParams: Promise<{ patientId?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "DOCTOR" && session.role !== "ADMIN") redirect("/patient");
  const { patientId } = await searchParams;
  if (!patientId) redirect("/doctor");
  const patient = await prisma.user.findFirst({ where: { id: patientId, role: "PATIENT" }, select: { id: true, name: true } });
  if (!patient) redirect("/doctor");
  return <MedicationForm patientId={patient.id} patientName={patient.name} />;
}
