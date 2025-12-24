import GroupDetail from "@/components/group/GroupDetail";
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
          boards: Array<{
            id: string;
            name: string;
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
          updatedAt: 'desc',
        },
      },
    },
  });

  return group;
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

  return <GroupDetail group={group} />;
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
