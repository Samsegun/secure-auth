-- DropForeignKey
ALTER TABLE "public"."refresh_tokens" DROP CONSTRAINT "refresh_tokens_userId_fkey";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "passwordResetExpiry" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;

-- AddForeignKey
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
