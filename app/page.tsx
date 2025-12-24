import GroupsContent from "@/components/home/GroupsContent";
import HomePage from "@/components/home/HomePage";
import Layout from "@/components/Layout";
import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";

export default async function Home() {
  const session = await getSession();

  if (!session?.user?.email) {
    return (
      <Layout>
        <HomePage />
      </Layout>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email || undefined },
  });

  const groups = user
    ? await (
        prisma as unknown as {
          group: {
            findMany: (args: {
              where: { userId: string };
              select: {
                id: boolean;
                name: boolean;
                backgroundColor: boolean;
                textColor: boolean;
              };
            }) => Promise<
              Array<{
                id: string;
                name: string;
                backgroundColor: string;
                textColor: string;
              }>
            >;
          };
        }
      ).group.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          name: true,
          backgroundColor: true,
          textColor: true,
        },
      })
    : [];

  return (
    <Layout>
      <GroupsContent groups={groups} />
    </Layout>
  );
}
