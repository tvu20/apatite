import GroupDetailPage from "@/components/pages/GroupDetailPage";
import Layout from "@/components/ui/Layout";
import Loader from "@/components/ui/Loader";
import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function getGroupData(groupId: string, userId: string) {
  const group = await (
    prisma as unknown as {
      group: {
        findFirst: (args: {
          where: { id: string; userId: string };
          include: {
            boards: {
              include: {
                notes: {
                  select: {
                    id: true;
                    imageUrl: true;
                  };
                  take: 1;
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
            };
          };
        }) => Promise<{
          id: string;
          name: string;
          description: string | null;
          backgroundColor: string;
          textColor: string;
          boards: Array<{
            id: string;
            name: string;
            createdAt: Date;
            notes: Array<{ id: string; imageUrl: string }>;
            _count: { notes: number };
          }>;
        } | null>;
      };
    }
  ).group.findFirst({
    where: { id: groupId, userId },
    include: {
      boards: {
        include: {
          notes: {
            select: {
              id: true,
              imageUrl: true,
            },
            take: 1,
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
      },
    },
  });

  if (!group) {
    return null;
  }

  // Add group information to each board for BoardItem component
  const boardsWithGroup = group.boards.map((board) => ({
    ...board,
    group: {
      id: group.id,
      name: group.name,
      backgroundColor: group.backgroundColor,
      textColor: group.textColor,
    },
  }));

  return {
    ...group,
    boards: boardsWithGroup,
  };
}

async function GroupContent({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const group = await getGroupData(groupId, userId);

  if (!group) {
    notFound();
  }

  return <GroupDetailPage group={group} />;
}

export default async function GroupPage({
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
        <GroupContent groupId={id} userId={user.id} />
      </Suspense>
    </Layout>
  );
}
