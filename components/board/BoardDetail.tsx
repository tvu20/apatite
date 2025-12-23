"use client";

import { useRouter } from "next/navigation";
import styles from "./BoardDetail.module.css";
import NoteImage from "./NoteImage";

type Board = {
  id: string;
  name: string;
  description: string | null;
  notes: Array<{
    id: string;
    imageUrl: string;
  }>;
  group: {
    id: string;
    name: string;
  };
};

type BoardDetailProps = {
  board: Board;
};

export default function BoardDetail({ board }: BoardDetailProps) {
  const router = useRouter();

  const handleReturnToGroup = () => {
    router.push(`/group/${board.group.id}`);
  };

  const handleEditBoard = () => {
    router.push(`/edit/${board.id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonRow}>
        <button onClick={handleReturnToGroup} className={styles.returnButton}>
          Return to {board.group.name}
        </button>
        <button onClick={handleEditBoard} className={styles.editButton}>
          edit board
        </button>
      </div>
      <h1 className={styles.title}>{board.name}</h1>
      {board.description && (
        <p className={styles.description}>{board.description}</p>
      )}
      <div className={styles.notesContainer}>
        {board.notes.map((note) => (
          <NoteImage key={note.id} imageUrl={note.imageUrl} />
        ))}
      </div>
    </div>
  );
}
