import { NextResponse } from "next/server";
import { getAllTasks, addTask } from "@/lib/data";

/**
 * GET /api/tasks
 * Mengambil seluruh tugas yang sudah disortir berdasarkan deadline terdekat.
 * Mendukung query ?filter=overdue untuk mengambil tugas yang melewati batas waktu namun belum selesai.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    let tasks = getAllTasks();

    if (filter === "overdue") {
      const now = new Date();
      tasks = tasks.filter((t) => !t.done && new Date(t.dueAt) < now);
    } else if (filter === "done") {
      tasks = tasks.filter((t) => t.done);
    } else if (filter === "pending") {
      tasks = tasks.filter((t) => !t.done);
    }

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data tugas", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks
 * Menambahkan tugas baru ke dalam daftar.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, dueAt } = body;

    // Validasi input
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Judul tugas wajib diisi." },
        { status: 400 }
      );
    }

    if (!dueAt || isNaN(Date.parse(dueAt))) {
      return NextResponse.json(
        { error: "Format tanggal dan waktu deadline tidak valid." },
        { status: 400 }
      );
    }

    const newTask = addTask(title.trim(), dueAt);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Format request tidak valid (JSON error)", details: String(error) },
      { status: 400 }
    );
  }
}

