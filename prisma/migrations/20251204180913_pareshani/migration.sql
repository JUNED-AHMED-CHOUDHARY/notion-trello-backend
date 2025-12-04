-- CreateEnum
CREATE TYPE "public"."ProviderEnum" AS ENUM ('github');

-- CreateEnum
CREATE TYPE "public"."Files_logs_type" AS ENUM ('NOTION', 'KANBAN');

-- CreateEnum
CREATE TYPE "public"."Files_logs_action_type" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password" VARCHAR(256),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meta" JSONB NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" "public"."ProviderEnum" NOT NULL,
    "provider_account_id" VARCHAR(256) NOT NULL,
    "access_token" VARCHAR(2000),
    "refresh_token" VARCHAR(2000),
    "access_token_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Workspaces" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "meta" JSONB NOT NULL,
    "owner_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Users_workspaces" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Files" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "meta" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notion_files" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "content" TEXT NOT NULL,
    "file_id" INTEGER NOT NULL,
    "meta" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notion_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Files_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "file_id" INTEGER NOT NULL,
    "meta" JSONB NOT NULL,
    "type" "public"."Files_logs_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action_type" "public"."Files_logs_action_type" NOT NULL DEFAULT 'UPDATE',
    "kanban_section_id" INTEGER,
    "kanban_field_id" INTEGER,
    "content" TEXT NOT NULL,

    CONSTRAINT "Files_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kanban_boards" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "background_img" TEXT,
    "file_id" INTEGER NOT NULL,
    "meta" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kanban_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kanban_sections" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "kanban_board_id" INTEGER NOT NULL,
    "meta" JSONB NOT NULL,
    "index" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kanban_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kanban_fields" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "kanban_section_id" INTEGER NOT NULL,
    "meta" JSONB NOT NULL,
    "index" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kanban_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE INDEX "providerAccountId" ON "public"."Account"("provider_account_id");

-- CreateIndex
CREATE INDEX "providerId" ON "public"."Account"("provider");

-- CreateIndex
CREATE INDEX "userId" ON "public"."Account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_provider_account_id_key" ON "public"."Account"("provider", "provider_account_id");

-- CreateIndex
CREATE INDEX "Users_workspaces_user_id_idx" ON "public"."Users_workspaces"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_workspaces_workspace_id_user_id_key" ON "public"."Users_workspaces"("workspace_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Notion_files_file_id_key" ON "public"."Notion_files"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "Kanban_boards_file_id_key" ON "public"."Kanban_boards"("file_id");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workspaces" ADD CONSTRAINT "Workspaces_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Users_workspaces" ADD CONSTRAINT "Users_workspaces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Users_workspaces" ADD CONSTRAINT "Users_workspaces_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."Workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Files" ADD CONSTRAINT "Files_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."Workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Files" ADD CONSTRAINT "Files_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notion_files" ADD CONSTRAINT "Notion_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Files_logs" ADD CONSTRAINT "Files_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Files_logs" ADD CONSTRAINT "files_logs_notion_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."Notion_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Files_logs" ADD CONSTRAINT "files_logs_kanban_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."Kanban_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Files_logs" ADD CONSTRAINT "Files_logs_kanban_section_id_fkey" FOREIGN KEY ("kanban_section_id") REFERENCES "public"."Kanban_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Files_logs" ADD CONSTRAINT "Files_logs_kanban_field_id_fkey" FOREIGN KEY ("kanban_field_id") REFERENCES "public"."Kanban_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Kanban_boards" ADD CONSTRAINT "Kanban_boards_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Kanban_sections" ADD CONSTRAINT "Kanban_sections_kanban_board_id_fkey" FOREIGN KEY ("kanban_board_id") REFERENCES "public"."Kanban_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Kanban_fields" ADD CONSTRAINT "Kanban_fields_kanban_section_id_fkey" FOREIGN KEY ("kanban_section_id") REFERENCES "public"."Kanban_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
