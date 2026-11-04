import { NextResponse } from "next/server";
import { updateTask, deleteTask, getTaskById } from "@/lib/data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/tasks/:id
 * Memperbarui sebagian data tugas (misalnya: menandai selesai/done, atau mengubah status notified).
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const taskId = Number(id);

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: "ID tugas harus berupa angka." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updated = updateTask(taskId, body);

    if (!updated) {
      return NextResponse.json(
        { error: `Tugas dengan ID ${taskId} tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui tugas.", details: String(error) },
      { status: 400 }
    );
  }
}

/**
 * PUT /api/tasks/:id
 * Memperbarui data tugas secara keseluruhan / edit judul dan deadline.
 */
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const taskId = Number(id);

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: "ID tugas harus berupa angka." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updated = updateTask(taskId, body);

    if (!updated) {
      return NextResponse.json(
        { error: `Tugas dengan ID ${taskId} tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui tugas.", details: String(error) },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/tasks/:id
 * Menghapus tugas dari sistem.
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const taskId = Number(id);

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: "ID tugas harus berupa angka." },
        { status: 400 }
      );
    }

    const existing = getTaskById(taskId);
    if (!existing) {
      return NextResponse.json(
        { error: `Tugas dengan ID ${taskId} tidak ditemukan.` },
        { status: 404 }
      );
    }

    const deleted = deleteTask(taskId);
    if (!deleted) {
      return NextResponse.json(
        { error: "Gagal menghapus tugas." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Tugas berhasil dihapus.", id: taskId },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus tugas.", details: String(error) },
      { status: 500 }
    );
  }
}

