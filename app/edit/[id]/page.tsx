import EditPage from "@/components/edit/EditPage";
import Layout from "@/components/ui/Layout";
import Loader from "@/components/ui/Loader";
import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function getBoardData(boardId: string, userId: string) {
  const board = await (
    prisma as unknown as {
      board: {
        findFirst: (args: {
          where: { id: string; userId: string };
          select: {
            id: boolean;
            name: boolean;
            description: boolean;
            groupId: boolean;
          };
        }) => Promise<{
          id: string;
          name: string;
          description: string | null;
          groupId: string;
        } | null>;
      };
    }
  ).board.findFirst({
    where: { id: boardId, userId },
    select: {
      id: true,
      name: true,
      description: true,
      groupId: true,
    },
  });

  return board;
}

async function getGroupsData(userId: string) {
  const groups = await (
    prisma as unknown as {
      group: {
        findMany: (args: {
          where: { userId: string };
          select: {
            id: boolean;
            name: boolean;
          };
        }) => Promise<
          Array<{
            id: string;
            name: string;
          }>
        >;
      };
    }
  ).group.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
    },
  });

  return groups;
}

async function EditContent({
  boardId,
  userId,
}: {
  boardId: string;
  userId: string;
}) {
  const board = await getBoardData(boardId, userId);
  const groups = await getGroupsData(userId);

  if (!board) {
    notFound();
  }

  return <EditPage board={board} groups={groups} />;
}

export default async function EditBoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.user?.email) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email || undefined },
  });

  if (!user) {
    notFound();
  }

  return (
    <Layout>
      <Suspense fallback={<Loader />}>
        <EditContent boardId={id} userId={user.id} />
      </Suspense>
    </Layout>
  );
}
