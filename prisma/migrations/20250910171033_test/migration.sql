-- CreateTable
CREATE TABLE "public"."Users" (
    "id" BIGSERIAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "public"."Users"("id");
