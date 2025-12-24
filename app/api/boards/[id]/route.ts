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

    // Verify the board belongs to the user
    const existingBoard = await (
      prisma as unknown as {
        board: {
          findFirst: (args: {
            where: { id: string; userId: string };
          }) => Promise<{ id: string; groupId: string } | null>;
        };
      }
    ).board.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingBoard) {
      return NextResponse.json(
        { error: "Board not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, groupId } = body;

    if (!name || !groupId) {
      return NextResponse.json(
        { error: "Name and groupId are required" },
        { status: 400 }
      );
    }

    // Verify the group belongs to the user
    const group = await (
      prisma as unknown as {
        group: {
          findFirst: (args: {
            where: { id: string; userId: string };
          }) => Promise<{ id: string } | null>;
        };
      }
    ).group.findFirst({
      where: { id: groupId, userId: user.id },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found or access denied" },
        { status: 404 }
      );
    }

    const oldGroupId = existingBoard.groupId;
    const groupIdChanged = oldGroupId !== groupId;

    // Update the board (updatedAt will be automatically set by @updatedAt)
    const board = await (
      prisma as unknown as {
        board: {
          update: (args: {
            where: { id: string };
            data: {
              name: string;
              description: string | null;
              groupId: string;
            };
          }) => Promise<{ id: string }>;
        };
      }
    ).board.update({
      where: { id },
      data: {
        name,
        description: description || null,
        groupId,
      },
    });

    // Update the group's updatedAt timestamp
    // If groupId changed, update both old and new groups
    await (
      prisma as unknown as {
        group: {
          update: (args: {
            where: { id: string };
            data: { updatedAt: Date };
          }) => Promise<void>;
        };
      }
    ).group.update({
      where: { id: groupId },
      data: { updatedAt: new Date() },
    });

    if (groupIdChanged) {
      await (
        prisma as unknown as {
          group: {
            update: (args: {
              where: { id: string };
              data: { updatedAt: Date };
            }) => Promise<void>;
          };
        }
      ).group.update({
        where: { id: oldGroupId },
        data: { updatedAt: new Date() },
      });
    }

    return NextResponse.json({ success: true, board }, { status: 200 });
  } catch (error) {
    console.error("Error updating board:", error);
    return NextResponse.json(
      { error: "Failed to update board" },
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

    // Verify the board belongs to the user and get groupId
    const existingBoard = await (
      prisma as unknown as {
        board: {
          findFirst: (args: {
            where: { id: string; userId: string };
          }) => Promise<{ id: string; groupId: string } | null>;
        };
      }
    ).board.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingBoard) {
      return NextResponse.json(
        { error: "Board not found or access denied" },
        { status: 404 }
      );
    }

    const groupId = existingBoard.groupId;

    // Delete the board (cascade will handle notes)
    await (
      prisma as unknown as {
        board: {
          delete: (args: { where: { id: string } }) => Promise<{ id: string }>;
        };
      }
    ).board.delete({
      where: { id },
    });

    // Update the group's updatedAt timestamp
    await (
      prisma as unknown as {
        group: {
          update: (args: {
            where: { id: string };
            data: { updatedAt: Date };
          }) => Promise<void>;
        };
      }
    ).group.update({
      where: { id: groupId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting board:", error);
    return NextResponse.json(
      { error: "Failed to delete board" },
      { status: 500 }
    );
  }
}
