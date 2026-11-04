"use client";

import { useState } from "react";
import { CreateTaskDTO } from "@/types/task";

interface TaskFormProps {
  onAddTask: (dto: CreateTaskDTO) => Promise<void>;
}

// Menghasilkan daftar jam 00 sampai 23
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

// Menghasilkan daftar menit 00 sampai 59
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Judul tugas tidak boleh kosong.");
      return;
    }

    if (!date) {
      setError("Silakan tentukan tanggal deadline.");
      return;
    }

    // Menggabungkan tanggal dan jam (00-23) : menit (00-59)
    const timeString = `${selectedHour}:${selectedMinute}:00`;
    const localDateTime = new Date(`${date}T${timeString}`);

    if (isNaN(localDateTime.getTime())) {
      setError("Format waktu tidak valid.");
      return;
    }

    setLoading(true);
    try {
      // Minta izin notifikasi melalui user gesture (klik tombol form) jika belum diizinkan
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "default"
      ) {
        await Notification.requestPermission();
      }

      await onAddTask({
        title: title.trim(),
        dueAt: localDateTime.toISOString(),
      });

      // Reset form setelah berhasil
      setTitle("");
      setDate("");
      setSelectedHour("12");
      setSelectedMinute("00");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menambahkan tugas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
        Tambah Tugas Baru
      </h2>

      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Judul Tugas
          </label>
          <input
            type="text"
            placeholder="Contoh: ngerjain laprak"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white text-gray-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Input Tanggal */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Tanggal Deadline
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white text-gray-900 cursor-pointer"
            />
          </div>

          {/* Pemilih Jam (00 - 23) dan Menit (00 - 59) */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Jam Deadline
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <select
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  disabled={loading}
                  className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white text-gray-900 cursor-pointer font-mono"
                  title="Pilih Jam (00 - 23)"
                >
                  {HOURS.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>

              <span className="font-bold text-gray-500">:</span>

              <div className="flex-1">
                <select
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(e.target.value)}
                  disabled={loading}
                  className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white text-gray-900 cursor-pointer font-mono"
                  title="Pilih Menit (00 - 59)"
                >
                  {MINUTES.map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded text-sm font-semibold text-white transition-colors cursor-pointer ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Tambah Tugas"}
          </button>
        </div>
      </div>
    </form>
  );
}
