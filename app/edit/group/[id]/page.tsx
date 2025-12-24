import Layout from "@/components/Layout";
import EditGroupPage from "@/components/edit/EditGroupPage";
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
          select: {
            id: boolean;
            name: boolean;
            description: boolean;
            backgroundColor: boolean;
            textColor: boolean;
          };
        }) => Promise<{
          id: string;
          name: string;
          description: string | null;
          backgroundColor: string;
          textColor: string;
        } | null>;
      };
    }
  ).group.findFirst({
    where: { id: groupId, userId },
    select: {
      id: true,
      name: true,
      description: true,
      backgroundColor: true,
      textColor: true,
    },
  });

  return group;
}

async function EditContent({
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

  return <EditGroupPage group={group} />;
}

export default async function EditGroupPageRoute({
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
        <EditContent groupId={id} userId={user.id} />
      </Suspense>
    </Layout>
  );
}
