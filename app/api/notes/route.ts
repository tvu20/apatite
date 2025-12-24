import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { name, description, imageUrl, link, boardId } = body;

    if (!name || !imageUrl || !boardId) {
      return NextResponse.json(
        { error: "Name, imageUrl, and boardId are required" },
        { status: 400 }
      );
    }

    // Verify the board belongs to the user
    const board = await (
      prisma as unknown as {
        board: {
          findFirst: (args: {
            where: { id: string; userId: string };
          }) => Promise<{ id: string } | null>;
        };
      }
    ).board.findFirst({
      where: { id: boardId, userId: user.id },
    });

    if (!board) {
      return NextResponse.json(
        { error: "Board not found or access denied" },
        { status: 404 }
      );
    }

    // Create the note
    const note = await (
      prisma as unknown as {
        note: {
          create: (args: {
            data: {
              name: string;
              description: string | null;
              imageUrl: string;
              link: string | null;
              userId: string;
              boardId: string;
            };
          }) => Promise<{ id: string }>;
        };
      }
    ).note.create({
      data: {
        name,
        description: description || null,
        imageUrl,
        link: link || null,
        userId: user.id,
        boardId,
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
      where: { id: boardId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
