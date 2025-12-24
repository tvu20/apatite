"use client";

import BoardCard from "@/components/cards/BoardCard";
import { Board } from "@/components/types";
import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import styles from "./GroupDetailPage.module.css";

type Group = {
  id: string;
  name: string;
  description: string | null;
  boards: Board[];
};

type GroupDetailPageProps = {
  group: Group;
};

export default function GroupDetailPage({ group }: GroupDetailPageProps) {
  const router = useRouter();

  const handleEditGroup = () => {
    router.push(`/edit/group/${group.id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{group.name}</h1>
        <button onClick={handleEditGroup}>
          <PencilSimpleLineIcon size={28} />
        </button>
      </div>

      <p className={styles.description}>
        {group.description || "No description provided."}
      </p>
      <div className="grid">
        {group.boards.map((board) => (
          <BoardCard key={board.id} board={board} showDescription />
        ))}
      </div>
    </div>
  );
}
