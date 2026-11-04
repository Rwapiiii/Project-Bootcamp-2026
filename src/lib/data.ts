import { Task } from "@/types/task";

interface Store {
  tasks: Task[];
  lastId: number;
}

// Menggunakan globalThis agar data in-memory tetap tersimpan selama server Next.js dev berjalan
const globalStore = globalThis as unknown as { __todoStore?: Store };

if (!globalStore.__todoStore) {
  // Contoh data awal untuk memudahkan pengujian
  const initialDate = new Date();
  initialDate.setHours(initialDate.getHours() + 1); // 1 jam ke depan

  globalStore.__todoStore = {
    tasks: [
      {
        id: 1,
        title: "Belajar Next.js API Routes",
        dueAt: initialDate.toISOString(),
        notified: false,
        done: false,
      },
    ],
    lastId: 1,
  };
}

export const store = globalStore.__todoStore;

/**
 * Mengambil semua tugas, disortir berdasarkan deadline (dueAt) terdekat
 */
export function getAllTasks(): Task[] {
  return [...store.tasks].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
  );
}

/**
 * Mengambil tugas yang belum selesai, belum dinotifikasi, dan sudah mencapai/melewati deadline
 */
export function getDueTasks(): Task[] {
  const now = new Date();
  return store.tasks.filter(
    (t) => !t.notified && new Date(t.dueAt) <= now
  );
}

/**
 * Mencari tugas berdasarkan ID
 */
export function getTaskById(id: number): Task | undefined {
  return store.tasks.find((t) => t.id === id);
}

/**
 * Menambahkan tugas baru
 */
export function addTask(title: string, dueAt: string): Task {
  store.lastId += 1;
  const newTask: Task = {
    id: store.lastId,
    title,
    dueAt,
    notified: false,
    done: false,
  };
  store.tasks.push(newTask);
  return newTask;
}

/**
 * Mengupdate data tugas (title, dueAt, done, atau notified)
 */
export function updateTask(
  id: number,
  data: Partial<Omit<Task, "id">>
): Task | null {
  const task = getTaskById(id);
  if (!task) return null;

  if (data.title !== undefined) task.title = data.title;
  if (data.dueAt !== undefined) task.dueAt = data.dueAt;
  if (data.done !== undefined) task.done = data.done;
  if (data.notified !== undefined) task.notified = data.notified;

  return task;
}

/**
 * Menghapus tugas berdasarkan ID
 */
export function deleteTask(id: number): boolean {
  const index = store.tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  store.tasks.splice(index, 1);
  return true;
}

