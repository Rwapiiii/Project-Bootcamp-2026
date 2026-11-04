"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "@/types/task";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/services/taskService";
import { TaskForm } from "@/components/TaskForm";
import { TaskFilter, FilterType } from "@/components/TaskFilter";
import { TaskList } from "@/components/TaskList";
import { useTodoReminder } from "@/hooks/useTodoReminder";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("pending");

  // Fungsi untuk memuat data tugas dari backend Next.js API Routes (GET /api/tasks)
  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat tugas.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Hook notifikasi Windows: langsung meminta izin saat pertama kali buka & polling tugas due
  useTodoReminder(loadTasks);

  // Load data pertama kali saat halaman dibuka
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handler: Tambah tugas baru (POST /api/tasks)
  const handleAddTask = async (dto: CreateTaskDTO) => {
    const newTask = await createTask(dto);
    setTasks((prev) =>
      [...prev, newTask].sort(
        (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
      )
    );
  };

  // Handler: Update tugas (PATCH / PUT /api/tasks/:id)
  const handleUpdateTask = async (id: number, dto: UpdateTaskDTO) => {
    const updated = await updateTask(id, dto);
    setTasks((prev) =>
      prev
        .map((t) => (t.id === id ? updated : t))
        .sort(
          (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
        )
    );
  };

  // Handler: Hapus tugas (DELETE /api/tasks/:id)
  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Hitung jumlah tugas untuk 2 kategori: "Belum Selesai" dan "Miss Deadline"
  const counts = useMemo(() => {
    const now = Date.now();
    return {
      pending: tasks.filter((t) => new Date(t.dueAt).getTime() >= now).length,
      missed: tasks.filter((t) => new Date(t.dueAt).getTime() < now).length,
    };
  }, [tasks]);

  // Saring daftar tugas sesuai filter tab yang aktif
  const filteredTasks = useMemo(() => {
    const now = Date.now();
    if (filter === "missed") {
      // Kategori Miss Deadline: tugas yang sudah melewati deadline
      return tasks.filter((t) => new Date(t.dueAt).getTime() < now);
    }
    // Kategori Belum Selesai: tugas yang deadline-nya belum terlewat
    return tasks.filter((t) => new Date(t.dueAt).getTime() >= now);
  }, [tasks, filter]);

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md border border-gray-200 p-6">
        {/* Judul Bersih sesuai PPT */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Todo App
        </h1>

        {/* Form Tambah Tugas (POST) */}
        <TaskForm onAddTask={handleAddTask} />

        {/* Error Alert jika terjadi kegagalan jaringan */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={loadTasks}
              className="text-xs underline font-semibold text-red-800 cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* 2 Kategori: Belum Selesai & Miss Deadline */}
        <TaskFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />

        {/* Daftar Tugas Langsung Muncul di Bawahnya */}
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </main>
  );
}
