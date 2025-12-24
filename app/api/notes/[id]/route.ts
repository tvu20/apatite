import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email || undefined },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the note belongs to the user and get boardId
    const existingNote = await (
      prisma as unknown as {
        note: {
          findFirst: (args: {
            where: { id: string; userId: string };
          }) => Promise<{ id: string; boardId: string } | null>;
        };
      }
    ).note.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: "Note not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, imageUrl, link } = body;

    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: "Name and imageUrl are required" },
        { status: 400 }
      );
    }

    // Update the note (updatedAt will be automatically set by @updatedAt)
    const note = await (
      prisma as unknown as {
        note: {
          update: (args: {
            where: { id: string };
            data: {
              name: string;
              description: string | null;
              imageUrl: string;
              link: string | null;
            };
          }) => Promise<{ id: string }>;
        };
      }
    ).note.update({
      where: { id },
      data: {
        name,
        description: description || null,
        imageUrl,
        link: link || null,
      },
    });

    // Update the board's updatedAt timestamp
    await (
      prisma as unknown as {
        board: {
          update: (args: {
            where: { id: string };
            data: { updatedAt: Date };
          }) => Promise<void>;
        };
      }
    ).board.update({
      where: { id: existingNote.boardId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, note }, { status: 200 });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email || undefined },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the note belongs to the user and get boardId
    const existingNote = await (
      prisma as unknown as {
        note: {
          findFirst: (args: {
            where: { id: string; userId: string };
          }) => Promise<{ id: string; boardId: string } | null>;
        };
      }
    ).note.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: "Note not found or access denied" },
        { status: 404 }
      );
    }

    const boardId = existingNote.boardId;

    // Delete the note
    await (
      prisma as unknown as {
        note: {
          delete: (args: { where: { id: string } }) => Promise<{ id: string }>;
        };
      }
    ).note.delete({
      where: { id },
    });

    // Update the board's updatedAt timestamp
    await (
      prisma as unknown as {
        board: {
          update: (args: {
            where: { id: string };
            data: { updatedAt: Date };
          }) => Promise<void>;
        };
      }
    ).board.update({
      where: { id: boardId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
