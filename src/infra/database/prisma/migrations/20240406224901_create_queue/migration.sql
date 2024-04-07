-- CreateTable
CREATE TABLE "Queue" (
    "id" VARCHAR(36) NOT NULL,
    "key" VARCHAR(32) NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tries" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB[],

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Queue_key_idx" ON "Queue"("key");

-- CreateIndex
CREATE INDEX "Queue_createdAt_idx" ON "Queue"("createdAt");
