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

    // Create the board
    const board = await (
      prisma as unknown as {
        board: {
          create: (args: {
            data: {
              name: string;
              description: string | null;
              groupId: string;
              userId: string;
            };
          }) => Promise<{ id: string }>;
        };
      }
    ).board.create({
      data: {
        name,
        description: description || null,
        groupId,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, board }, { status: 201 });
  } catch (error) {
    console.error("Error creating board:", error);
    return NextResponse.json(
      { error: "Failed to create board" },
      { status: 500 }
    );
  }
}
