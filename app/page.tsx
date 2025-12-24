import GroupsPage from "@/components/home/GroupsPage";
import HomePage from "@/components/home/HomePage";
import Layout from "@/components/ui/Layout";
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
                description: boolean;
                backgroundColor: boolean;
                textColor: boolean;
                createdAt: boolean;
                _count: { select: { boards: boolean } };
              };
              orderBy: { createdAt: "desc" | "asc" };
            }) => Promise<
              Array<{
                id: string;
                name: string;
                description: string | null;
                backgroundColor: string;
                textColor: string;
                createdAt: Date;
                _count: { boards: number };
              }>
            >;
          };
        }
      ).group.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          name: true,
          description: true,
          backgroundColor: true,
          textColor: true,
          createdAt: true,
          _count: {
            select: {
              boards: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <Layout>
      <GroupsPage groups={groups} />
    </Layout>
  );
}
