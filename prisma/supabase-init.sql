-- MyMedicine initial PostgreSQL schema for Supabase SQL Editor.
CREATE SCHEMA IF NOT EXISTS "public";

DO $$ BEGIN CREATE TYPE "Role" AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "MealTiming" AS ENUM ('BEFORE_MEAL', 'AFTER_MEAL', 'WITH_MEAL', 'OTHER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "HistoryStatus" AS ENUM ('TAKEN', 'SKIPPED', 'MISSED', 'SNOOZED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "NotificationChannel" AS ENUM ('BROWSER', 'EMAIL', 'SOUND', 'POPUP'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'READ', 'FAILED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'PATIENT';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'DOCTOR';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'ADMIN';

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'PATIENT',
  "name" TEXT NOT NULL,
  "imageUrl" TEXT,
  "dateOfBirth" TIMESTAMP(3),
  "phone" TEXT,
  "conditions" TEXT,
  "allergies" TEXT,
  "weightKg" DOUBLE PRECISION,
  "heightCm" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Medication" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT,
  "type" TEXT,
  "dosage" TEXT,
  "unit" TEXT,
  "mealTiming" "MealTiming" NOT NULL DEFAULT 'AFTER_MEAL',
  "remainingQuantity" INTEGER NOT NULL DEFAULT 0,
  "lowStockThreshold" INTEGER NOT NULL DEFAULT 10,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  "timeDescription" TEXT,
  "timesPerDay" INTEGER NOT NULL DEFAULT 1,
  "notes" TEXT,
  "color" TEXT NOT NULL DEFAULT '#1769B0',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Schedule" (
  "id" TEXT NOT NULL,
  "medicationId" TEXT NOT NULL,
  "time" TEXT NOT NULL,
  "dayOfWeek" INTEGER,
  "status" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "History" (
  "id" TEXT NOT NULL,
  "medicationId" TEXT NOT NULL,
  "scheduleId" TEXT,
  "date" TIMESTAMP(3) NOT NULL,
  "timeTaken" TEXT,
  "status" "HistoryStatus" NOT NULL DEFAULT 'TAKEN',
  "isTaken" BOOLEAN NOT NULL DEFAULT false,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "medicationId" TEXT,
  "channel" "NotificationChannel" NOT NULL,
  "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "scheduledFor" TIMESTAMP(3) NOT NULL,
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "entityId" TEXT,
  "metadata" TEXT,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "RefreshToken" (
  "id" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE INDEX IF NOT EXISTS "Medication_userId_createdAt_idx" ON "Medication"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Schedule_medicationId_status_idx" ON "Schedule"("medicationId", "status");
CREATE INDEX IF NOT EXISTS "History_medicationId_date_idx" ON "History"("medicationId", "date");
CREATE INDEX IF NOT EXISTS "History_scheduleId_date_idx" ON "History"("scheduleId", "date");
CREATE INDEX IF NOT EXISTS "Notification_userId_status_scheduledFor_idx" ON "Notification"("userId", "status", "scheduledFor");
CREATE INDEX IF NOT EXISTS "AuditLog_entity_createdAt_idx" ON "AuditLog"("entity", "createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");
CREATE INDEX IF NOT EXISTS "RefreshToken_userId_expiresAt_idx" ON "RefreshToken"("userId", "expiresAt");

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Medication_userId_fkey') THEN ALTER TABLE "Medication" ADD CONSTRAINT "Medication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Schedule_medicationId_fkey') THEN ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'History_medicationId_fkey') THEN ALTER TABLE "History" ADD CONSTRAINT "History_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'History_scheduleId_fkey') THEN ALTER TABLE "History" ADD CONSTRAINT "History_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Notification_userId_fkey') THEN ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Notification_medicationId_fkey') THEN ALTER TABLE "Notification" ADD CONSTRAINT "Notification_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AuditLog_userId_fkey') THEN ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RefreshToken_userId_fkey') THEN ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
