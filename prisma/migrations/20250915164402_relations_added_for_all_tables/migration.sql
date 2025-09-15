/*
  Warnings:

  - A unique constraint covering the columns `[file_id]` on the table `Kanban_boards` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[file_id]` on the table `Notion_files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `Files_logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Files_logs_action_type" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- AlterTable
ALTER TABLE "public"."Files_logs" ADD COLUMN     "action_type" "public"."Files_logs_action_type" NOT NULL DEFAULT 'UPDATE',
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "kanban_field_id" BIGINT,
ADD COLUMN     "kanban_section_id" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "Kanban_boards_file_id_key" ON "public"."Kanban_boards"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "Notion_files_file_id_key" ON "public"."Notion_files"("file_id");

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
