import { NextResponse } from "next/server";
import { getDueTasks } from "@/lib/data";

/**
 * GET /api/tasks/due
 * Mengambil tugas yang belum selesai, belum dinotifikasi, dan telah mencapai atau melewati deadline.
 * Digunakan oleh polling frontend untuk menampilkan notifikasi desktop Windows.
 */
export async function GET() {
  try {
    const dueTasks = getDueTasks();
    return NextResponse.json(dueTasks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil daftar tugas due", details: String(error) },
      { status: 500 }
    );
  }
}

