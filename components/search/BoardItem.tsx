"use client";

import { Board } from "@/components/types";
import { formatDate } from "@/lib/utils";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import styles from "./BoardItem.module.css";

type BoardItemProps = {
  board: Board;
};

export default function BoardItem({ board }: BoardItemProps) {
  const router = useRouter();
  const firstNoteImage = board.notes?.[0]?.imageUrl || null;
  const placeholderImageUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5qROQFV_3SDisHS4ISFujMVkZQq528xxgKg&s";
  const imageUrl = firstNoteImage || placeholderImageUrl;
  const noteCount = board._count?.notes || 0;
  const group = board.group;
  const formattedDate = board.createdAt ? formatDate(board.createdAt) : "";

  const handleClick = () => {
    router.push(`/board/${board.id}`);
  };

  return (
    <div
      className={styles.item}
      style={{
        backgroundColor: group?.backgroundColor || "#f0f0f0",
      }}
      onClick={handleClick}
    >
      <img src={imageUrl} alt="" className={styles.image} />
      <div className={styles.content}>
        <h2
          className="card-name"
          style={{
            color: group?.textColor || "#333333",
          }}
        >
          {board.name}
        </h2>
        <p className="card-count">
          {noteCount} {noteCount === 1 ? "note" : "notes"}
        </p>
        {/* {board.description && (
          <p className="card-description">{board.description}</p>
        )} */}
        {formattedDate && (
          <div className="card-date-container">
            <span>Created {formattedDate}</span>
            <ArrowRightIcon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
