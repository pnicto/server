-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_taskcardId_fkey";

-- DropForeignKey
ALTER TABLE "Taskcard" DROP CONSTRAINT "Taskcard_taskboardId_fkey";

-- AddForeignKey
ALTER TABLE "Taskcard" ADD CONSTRAINT "Taskcard_taskboardId_fkey" FOREIGN KEY ("taskboardId") REFERENCES "Taskboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_taskcardId_fkey" FOREIGN KEY ("taskcardId") REFERENCES "Taskcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
