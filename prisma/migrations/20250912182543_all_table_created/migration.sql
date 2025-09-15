/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meta` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Files_logs_type" AS ENUM ('NOTION', 'KANBAN');

-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" VARCHAR(256) NOT NULL,
ADD COLUMN     "meta" JSONB NOT NULL,
ADD COLUMN     "name" VARCHAR(60) NOT NULL,
ADD COLUMN     "password" VARCHAR(256),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "public"."Users_id_key";

-- CreateTable
CREATE TABLE "public"."Workspaces" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "meta" JSONB NOT NULL,
    "owner_user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Users_workspaces" (
    "id" BIGSERIAL NOT NULL,
    "workspace_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Files" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "workspace_id" BIGINT NOT NULL,
    "parent_id" BIGINT,
    "meta" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notion_files" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "content" TEXT NOT NULL,
    "file_id" BIGINT NOT NULL,
    "meta" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notion_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Files_logs" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "file_id" BIGINT NOT NULL,
    "meta" JSONB NOT NULL,
    "type" "public"."Files_logs_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Files_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kanban_boards" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "background_img" TEXT,
    "file_id" BIGINT NOT NULL,
    "meta" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kanban_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kanban_sections" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "kanban_board_id" BIGINT NOT NULL,
    "meta" JSONB NOT NULL,
    "index" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kanban_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kanban_fields" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "kanban_section_id" BIGINT NOT NULL,
    "meta" JSONB NOT NULL,
    "index" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kanban_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_workspaces_workspace_id_user_id_key" ON "public"."Users_workspaces"("workspace_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");
