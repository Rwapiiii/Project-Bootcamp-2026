"use client";

import { Task, UpdateTaskDTO } from "@/types/task";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onUpdate: (id: number, dto: UpdateTaskDTO) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskList({ tasks, loading, onUpdate, onDelete }: TaskListProps) {
  if (loading && tasks.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        Memuat daftar tugas...
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500">
        Belum ada tugas pada kategori ini.
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

