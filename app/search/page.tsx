import SearchPageComponent from "@/components/search/SearchPage";
import Layout from "@/components/ui/Layout";
import Loader from "@/components/ui/Loader";
import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function getBoardsData(userId: string) {
  const boards = await (
    prisma as unknown as {
      board: {
        findMany: (args: {
          where: { userId: string };
          include: {
            notes: {
              select: {
                id: true;
                imageUrl: true;
              };
              take: 1;
            };
            group: {
              select: {
                id: true;
                name: true;
                backgroundColor: true;
                textColor: true;
              };
            };
            _count: {
              select: {
                notes: true;
              };
            };
          };
          orderBy?: {
            updatedAt: "asc" | "desc";
          };
        }) => Promise<
          Array<{
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            notes: Array<{ id: string; imageUrl: string }>;
            group: {
              id: string;
              name: string;
              backgroundColor: string;
              textColor: string;
            };
            _count: {
              notes: number;
            };
          }>
        >;
      };
    }
  ).board.findMany({
    where: { userId },
    include: {
      notes: {
        select: {
          id: true,
          imageUrl: true,
        },
        take: 1,
      },
      group: {
        select: {
          id: true,
          name: true,
          backgroundColor: true,
          textColor: true,
        },
      },
      _count: {
        select: {
          notes: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return boards;
}

async function BoardsContent({ userId }: { userId: string }) {
  const boards = await getBoardsData(userId);

  return <SearchPageComponent boards={boards} />;
}

export default async function SearchPage() {
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
        <BoardsContent userId={user.id} />
      </Suspense>
    </Layout>
  );
}
