export interface Task {
  id: number;
  title: string;
  dueAt: string; // Format ISO 8601 (contoh: "2026-11-04T15:00:00.000Z")
  notified: boolean; // Menandakan apakah notifikasi deadline sudah pernah dikirim
  done: boolean; // Status tugas: true jika sudah selesai, false jika belum
}

export interface CreateTaskDTO {
  title: string;
  dueAt: string;
}

export interface UpdateTaskDTO {
  title?: string;
  dueAt?: string;
  done?: boolean;
  notified?: boolean;
}

