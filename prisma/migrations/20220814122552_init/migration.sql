-- CreateTable
CREATE TABLE "Taskboard" (
    "id" SERIAL NOT NULL,
    "boardTitle" TEXT NOT NULL,

    CONSTRAINT "Taskboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Taskcard" (
    "id" SERIAL NOT NULL,
    "cardTitle" TEXT NOT NULL,
    "taskboardId" INTEGER NOT NULL,

    CONSTRAINT "Taskcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "taskcardId" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Taskcard" ADD CONSTRAINT "Taskcard_taskboardId_fkey" FOREIGN KEY ("taskboardId") REFERENCES "Taskboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_taskcardId_fkey" FOREIGN KEY ("taskcardId") REFERENCES "Taskcard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
