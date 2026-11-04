"use client";

import { useEffect, useRef } from "react";
import { fetchDueTasks, updateTask } from "@/services/taskService";

export function useTodoReminder(onTaskNotified?: () => void) {
  const onTaskNotifiedRef = useRef(onTaskNotified);

  useEffect(() => {
    onTaskNotifiedRef.current = onTaskNotified;
  }, [onTaskNotified]);

  // Minta izin notifikasi browser melalui interaksi user pertama (klik di halaman)
  // Ini menghindari browser Chromium/Chrome memblokir requestPermission tanpa user gesture
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const askPermission = async () => {
      if (Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch (err) {
          console.error("Gagal meminta izin notifikasi:", err);
        }
      }
    };

    // Coba minta langsung saat load
    askPermission();

    // Dan pasang di klik pertama agar 100% diizinkan oleh kebijakan gesture browser
    window.addEventListener("click", askPermission, { once: true });

    return () => {
      window.removeEventListener("click", askPermission);
    };
  }, []);

  // Polling untuk memeriksa tugas yang jatuh tempo
  useEffect(() => {
    async function checkDueTasks() {
      if (typeof window === "undefined" || !("Notification" in window)) return;

      try {
        const dueTasks = await fetchDueTasks();

        if (dueTasks.length > 0) {
          // Hanya jika izin sudah "granted" kita tampilkan notifikasi dan set notified: true
          if (Notification.permission === "granted") {
            for (const task of dueTasks) {
              try {
                const notif = new Notification("Todo App", {
                  body: `Tugas "${task.title}" udh kelewat deadline`,
                  tag: `task-${task.id}`, // Mencegah duplikasi toast
                  requireInteraction: true,
                });

                notif.onclick = () => {
                  window.focus();
                };

                // HANYA tandai notified: true setelah notifikasi sukses dibuat
                await updateTask(task.id, { notified: true });
              } catch (e) {
                console.error("Gagal menampilkan notifikasi:", e);
              }
            }

            // Muat ulang daftar tugas agar kategori / UI terupdate
            if (onTaskNotifiedRef.current) {
              onTaskNotifiedRef.current();
            }
          }
        }
      } catch (err) {
        console.error("Error saat polling tugas due:", err);
      }
    }

    // Jalankan langsung sekali saat load
    checkDueTasks();

    // Jalankan polling tiap 5 detik agar cepat terdeteksi saat pengujian demo
    const intervalId = setInterval(checkDueTasks, 5000);

    // Cleanup interval saat komponen unmount
    return () => clearInterval(intervalId);
  }, []);
}
