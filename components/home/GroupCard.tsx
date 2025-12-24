"use client";

import { Group } from "@/components/types";
import { formatDate } from "@/lib/utils";
import { ArrowRightIcon } from "@phosphor-icons/react";
import styles from "./GroupCard.module.css";

type GroupCardProps = {
  group: Group;
  onClick: (groupId: string) => void;
};

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
      <h2 className="card-name">{group.name}</h2>
      <div className="card-count">
        {boardsCount} board{boardsCount !== 1 ? "s" : ""}
      </div>
      <p className="card-description">
        {group.description || "No description provided."}
      </p>
      <div className="card-date-container">
        <span>Created {formattedDate}</span>
        <ArrowRightIcon size={24} />
      </div>
    </div>
  );
}
