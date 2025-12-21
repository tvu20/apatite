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
    const { name, description, backgroundColor, textColor } = body;

    if (!name || !backgroundColor || !textColor) {
      return NextResponse.json(
        { error: "Name, backgroundColor, and textColor are required" },
        { status: 400 }
      );
    }

    // Create the group
    const group = await (
      prisma as unknown as {
        group: {
          create: (args: {
            data: {
              name: string;
              description: string | null;
              backgroundColor: string;
              textColor: string;
              userId: string;
            };
          }) => Promise<{ id: string }>;
        };
      }
    ).group.create({
      data: {
        name,
        description: description || null,
        backgroundColor,
        textColor,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, group }, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
