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

    // Verify the group belongs to the user
    const existingGroup = await (
      prisma as unknown as {
        group: {
          findFirst: (args: {
            where: { id: string; userId: string };
          }) => Promise<{ id: string } | null>;
        };
      }
    ).group.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: "Group not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, backgroundColor, textColor } = body;

    if (!name || !backgroundColor || !textColor) {
      return NextResponse.json(
        { error: "Name, backgroundColor, and textColor are required" },
        { status: 400 }
      );
    }

    // Update the group
    const group = await (
      prisma as unknown as {
        group: {
          update: (args: {
            where: { id: string };
            data: {
              name: string;
              description: string | null;
              backgroundColor: string;
              textColor: string;
            };
          }) => Promise<{ id: string }>;
        };
      }
    ).group.update({
      where: { id },
      data: {
        name,
        description: description || null,
        backgroundColor,
        textColor,
      },
    });

    return NextResponse.json({ success: true, group }, { status: 200 });
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json(
      { error: "Failed to update group" },
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

    // Verify the group belongs to the user
    const existingGroup = await (
      prisma as unknown as {
        group: {
          findFirst: (args: {
            where: { id: string; userId: string };
          }) => Promise<{ id: string } | null>;
        };
      }
    ).group.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: "Group not found or access denied" },
        { status: 404 }
      );
    }

    // Delete the group (cascade will handle boards and notes)
    await (
      prisma as unknown as {
        group: {
          delete: (args: { where: { id: string } }) => Promise<{ id: string }>;
        };
      }
    ).group.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
