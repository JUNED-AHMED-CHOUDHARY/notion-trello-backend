import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = 1;
  const workspaceId = 1;

  // Check if workspace exists
  const workspace = await prisma.workspaces.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new Error(`Workspace with ID ${workspaceId} not found`);
  }

  // Create root file
  const rootFile = await prisma.files.create({
    data: {
      name: "Main Root File",
      workspace_id: workspaceId,
      meta: { root: true },
    },
  });

  // Notion File
  const notion = await prisma.notion_files.create({
    data: {
      name: "Team Notes",
      content: "This is the main team documentation.",
      file_id: rootFile.id,
      meta: { tags: ["meeting", "overview"] },
    },
  });

  // Kanban Board
  const board = await prisma.kanban_boards.create({
    data: {
      name: "Q1 Roadmap",
      file_id: rootFile.id,
      meta: { version: 1 },
    },
  });

  // Sections
  const sectionBacklog = await prisma.kanban_sections.create({
    data: {
      name: "Backlog",
      kanban_board_id: board.id,
      index: 0,
      meta: { color: "gray" },
    },
  });

  const sectionInProgress = await prisma.kanban_sections.create({
    data: {
      name: "In Progress",
      kanban_board_id: board.id,
      index: 1,
      meta: { color: "blue" },
    },
  });

  // Tasks
  const task1 = await prisma.kanban_fields.create({
    data: {
      name: "Login Feature",
      title: "Implement user login",
      description: "OAuth & email/password login",
      kanban_section_id: sectionBacklog.id,
      index: 0,
      meta: { epic: "Auth" },
    },
  });

  const task2 = await prisma.kanban_fields.create({
    data: {
      name: "UI Polish",
      title: "Improve dashboard UI",
      description: "Tweak spacing and layout",
      kanban_section_id: sectionBacklog.id,
      index: 1,
      meta: { epic: "UX" },
    },
  });

  const task3 = await prisma.kanban_fields.create({
    data: {
      name: "Notification Service",
      title: "Real-time notifications",
      description: "Integrate with WebSocket",
      kanban_section_id: sectionInProgress.id,
      index: 0,
      meta: { epic: "Messaging" },
    },
  });

  const task4 = await prisma.kanban_fields.create({
    data: {
      name: "Analytics Setup",
      title: "Track user events",
      description: "Google Analytics + custom",
      kanban_section_id: sectionInProgress.id,
      index: 1,
      meta: { epic: "Tracking" },
    },
  });

  // Logs
  await prisma.files_logs.createMany({
    data: [
      {
        user_id: userId,
        file_id: notion.id,
        type: "NOTION",
        action_type: "UPDATE",
        meta: { change: "Created content" },
        content: "Initial notion file created",
      },
      {
        user_id: userId,
        file_id: board.id,
        type: "KANBAN",
        action_type: "CREATE",
        kanban_section_id: sectionBacklog.id,
        kanban_field_id: task1.id,
        meta: { note: "Backlog task added" },
        content: "Created login feature task",
      },
      {
        user_id: userId,
        file_id: board.id,
        type: "KANBAN",
        action_type: "CREATE",
        kanban_section_id: sectionInProgress.id,
        kanban_field_id: task3.id,
        meta: { note: "Progress task added" },
        content: "Created notification service task",
      },
    ],
  });

  console.log("✅ Seeded data for workspace_id = 1 and user_id = 1");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("❌ Seed error:", err);
    return prisma.$disconnect();
  });
