import Layout from "@/components/Layout";
import PageContent from "@/components/PageContent";
import BoardDetail from "@/components/board/BoardDetail";
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
          include: {
            notes: {
              select: {
                id: true;
                imageUrl: true;
              };
            };
          };
        }) => Promise<{
          id: string;
          name: string;
          description: string | null;
          notes: Array<{
            id: string;
            imageUrl: string;
          }>;
        } | null>;
      };
    }
  ).board.findFirst({
    where: { id: boardId, userId },
    include: {
      notes: {
        select: {
          id: true,
          imageUrl: true,
        },
      },
    },
  });

  return board;
}

async function BoardContent({
  boardId,
  userId,
}: {
  boardId: string;
  userId: string;
}) {
  const board = await getBoardData(boardId, userId);

  if (!board) {
    notFound();
  }

  return <BoardDetail board={board} />;
}

export default async function BoardPage({
  params,
}: {
  params: { id: string };
}) {
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
      <PageContent>
        <Suspense fallback={<Loader />}>
          <BoardContent boardId={params.id} userId={user.id} />
        </Suspense>
      </PageContent>
    </Layout>
  );
}
