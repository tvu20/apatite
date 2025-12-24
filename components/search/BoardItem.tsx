"use client";

import { Board } from "@/components/types";
import { useRouter } from "next/navigation";
import styles from "./BoardItem.module.css";

type BoardItemProps = {
  board: Board;
};

export default function BoardItem({ board }: BoardItemProps) {
  const router = useRouter();
  const firstNoteImage = board.notes?.[0]?.imageUrl || null;

  const handleClick = () => {
    router.push(`/board/${board.id}`);
  };

  return (
    <div className={styles.item} onClick={handleClick}>
      {firstNoteImage && (
        <img src={firstNoteImage} alt="" className={styles.image} />
      )}
      <p className={styles.name}>{board.name}</p>
    </div>
  );
}
