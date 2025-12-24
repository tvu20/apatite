"use client";

import { Group } from "@/components/types";
import { ArrowRightIcon } from "@phosphor-icons/react";
import styles from "./GroupCard.module.css";

type GroupCardProps = {
  group: Group;
  onClick: (groupId: string) => void;
};

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function GroupCard({ group, onClick }: GroupCardProps) {
  const boardsCount = group._count?.boards ?? 0;
  const formattedDate = formatDate(group.createdAt);

  return (
    <div
      className={styles.groupItem}
      onClick={() => onClick(group.id)}
      style={
        {
          "--group-bg-color": group.backgroundColor,
          "--group-text-color": group.textColor,
        } as React.CSSProperties
      }
    >
      <h2 className={styles.name}>{group.name}</h2>
      <div className={styles.boardsCount}>
        {boardsCount} board{boardsCount !== 1 ? "s" : ""}
      </div>
      {group.description && (
        <p className={styles.description}>{group.description}</p>
      )}
      <div className={styles.dateContainer}>
        <span className={styles.createdDate}>Created {formattedDate}</span>
        <ArrowRightIcon size={24} />
      </div>
    </div>
  );
}
