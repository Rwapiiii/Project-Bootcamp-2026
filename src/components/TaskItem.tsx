"use client";

import { useState } from "react";
import { Task, UpdateTaskDTO } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, dto: UpdateTaskDTO) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

// Menghasilkan daftar jam 00 sampai 23
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

// Menghasilkan daftar menit 00 sampai 59
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  // Ambil date & time dari task.dueAt untuk prefill form edit
  const dueDate = new Date(task.dueAt);
  const initialDateStr = !isNaN(dueDate.getTime())
    ? dueDate.toISOString().split("T")[0]
    : "";
  const initialHourStr = !isNaN(dueDate.getTime())
    ? String(dueDate.getHours()).padStart(2, "0")
    : "12";
  const initialMinuteStr = !isNaN(dueDate.getTime())
    ? String(dueDate.getMinutes()).padStart(2, "0")
    : "00";

  const [editDate, setEditDate] = useState(initialDateStr);
  const [editHour, setEditHour] = useState(initialHourStr);
  const [editMinute, setEditMinute] = useState(initialMinuteStr);
  const [loading, setLoading] = useState(false);

  const isOverdue = new Date(task.dueAt).getTime() < Date.now();

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert("Judul tidak boleh kosong.");
      return;
    }

    let newDueAt = task.dueAt;
    if (editDate) {
      const timeString = `${editHour}:${editMinute}:00`;
      const localDateTime = new Date(`${editDate}T${timeString}`);
      if (!isNaN(localDateTime.getTime())) {
        newDueAt = localDateTime.toISOString();
      }
    }

    setLoading(true);
    try {
      await onUpdate(task.id, {
        title: editTitle.trim(),
        dueAt: newDueAt,
        notified: false, // Reset notifikasi jika tugas diedit agar dapat memicu pengingat ulang
      });
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Apakah Anda yakin ingin menghapus tugas "${task.title}"?`)) {
      setLoading(true);
      try {
        await onDelete(task.id);
      } finally {
        setLoading(false);
      }
    }
  };

  // Format tanggal deadline agar mudah dibaca dalam bahasa Indonesia
  const formatDeadline = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return isoString;
    }
  };

  if (isEditing) {
    return (
      <li className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg space-y-2">
        <div className="font-semibold text-xs text-yellow-800">Edit Tugas:</div>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900"
          placeholder="Judul tugas"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 cursor-pointer"
          />
          <div className="flex items-center gap-1">
            <select
              value={editHour}
              onChange={(e) => setEditHour(e.target.value)}
              className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 cursor-pointer font-mono"
              title="Jam (00 - 23)"
            >
              {HOURS.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            <span className="font-bold text-gray-500">:</span>
            <select
              value={editMinute}
              onChange={(e) => setEditMinute(e.target.value)}
              className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 cursor-pointer font-mono"
              title="Menit (00 - 59)"
            >
              {MINUTES.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSaveEdit}
            disabled={loading}
            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white font-medium rounded cursor-pointer"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </li>
    );
  }

  return (
    <li
      className={`p-3 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isOverdue
          ? "bg-red-50 border-red-200"
          : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
      }`}
    >
      {/* Info Tugas Tanpa Checkbox */}
      <div className="flex-1 min-w-0">
        <span
          className={`font-medium text-sm break-words block ${
            isOverdue ? "text-red-900 font-semibold" : "text-gray-900"
          }`}
        >
          {task.title}
        </span>

        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
          <span>Deadline:</span>
          <span className={isOverdue ? "text-red-700 font-semibold" : "text-gray-700"}>
            {formatDeadline(task.dueAt)}
          </span>
        </div>
      </div>

      {/* Tombol Aksi: Edit & Hapus */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={loading}
          className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors cursor-pointer"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors cursor-pointer"
        >
          Hapus
        </button>
      </div>
    </li>
  );
}
