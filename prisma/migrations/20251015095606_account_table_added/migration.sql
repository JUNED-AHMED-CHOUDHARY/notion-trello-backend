-- CreateEnum
CREATE TYPE "public"."ProviderEnum" AS ENUM ('github');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "provider" "public"."ProviderEnum" NOT NULL,
    "provider_account_id" VARCHAR(256) NOT NULL,
    "access_token" VARCHAR(2000),
    "refresh_token" VARCHAR(2000),
    "access_token_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "providerAccountId" ON "public"."Account"("provider_account_id");

-- CreateIndex
CREATE INDEX "providerId" ON "public"."Account"("provider");

-- CreateIndex
CREATE INDEX "userId" ON "public"."Account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_provider_account_id_key" ON "public"."Account"("provider", "provider_account_id");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
