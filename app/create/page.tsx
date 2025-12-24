import CreatePageContent from "@/components/create/CreatePage";
import Layout from "@/components/ui/Layout";
import Loader from "@/components/ui/Loader";
import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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

async function GroupsContent({ userId }: { userId: string }) {
  const groups = await getGroupsData(userId);

  return <CreatePageContent groups={groups} />;
}

export default async function CreatePage() {
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
        <GroupsContent userId={user.id} />
      </Suspense>
    </Layout>
  );
}
