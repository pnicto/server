-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "completed" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Taskboard" ALTER COLUMN "boardTitle" DROP NOT NULL,
ALTER COLUMN "boardTitle" SET DEFAULT 'New Board';
