"use client";

import { useRouter } from "next/navigation";
import BoardCard from "./BoardCard";
import styles from "./GroupDetail.module.css";

type Group = {
  id: string;
  name: string;
  description: string | null;
  boards: Array<{
    id: string;
    name: string;
    notes: Array<{ id: string; imageUrl: string }>;
    _count: { notes: number };
  }>;
};

type GroupDetailProps = {
  group: Group;
};

export default function GroupDetail({ group }: GroupDetailProps) {
  const router = useRouter();

  const handleEditGroup = () => {
    router.push(`/edit/group/${group.id}`);
  };

  return (
    <div className={styles.container}>
      <button onClick={handleEditGroup} className={styles.editButton}>
        edit group
      </button>
      <h1 className={styles.title}>{group.name}</h1>
      {group.description && (
        <p className={styles.description}>{group.description}</p>
      )}
      <div className={styles.boardsContainer}>
        {group.boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
}
