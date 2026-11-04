import { Task, CreateTaskDTO, UpdateTaskDTO } from "@/types/task";

/**
 * Service client-side untuk berkomunikasi dengan Next.js API Routes (/api/tasks)
 */

export async function fetchTasks(filter?: string): Promise<Task[]> {
  const url = filter && filter !== "all" ? `/api/tasks?filter=${filter}` : "/api/tasks";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal mengambil daftar tugas");
  }
  return res.json();
}

export async function createTask(dto: CreateTaskDTO): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal menambahkan tugas");
  }

  return res.json();
}

export async function updateTask(id: number, dto: UpdateTaskDTO): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal memperbarui tugas");
  }

  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal menghapus tugas");
  }
}

export async function fetchDueTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks/due", { cache: "no-store" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal memeriksa tugas jatuh tempo");
  }
  return res.json();
}

