-- CreateTable
CREATE TABLE "ResetPasswordToken" (
    "token" VARCHAR(36) NOT NULL,
    "email" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '1 day',

    CONSTRAINT "ResetPasswordToken_pkey" PRIMARY KEY ("token")
);

-- AddForeignKey
ALTER TABLE "ResetPasswordToken" ADD CONSTRAINT "ResetPasswordToken_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
