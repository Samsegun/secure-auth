-- AlterTable
ALTER TABLE "public"."refresh_tokens" ADD COLUMN     "isRevoked" BOOLEAN NOT NULL DEFAULT false;
