"use client";

import { useRouter } from "next/navigation";
import styles from "./GroupsList.module.css";

type Group = {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
};

type GroupsListProps = {
  groups: Group[];
};

export default function GroupsList({ groups }: GroupsListProps) {
  const router = useRouter();

  const handleGroupClick = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  return (
    <div className={styles.container}>
      {groups.map((group) => (
        <div
          key={group.id}
          className={styles.groupItem}
          onClick={() => handleGroupClick(group.id)}
          style={
            {
              "--group-bg-color": group.backgroundColor,
              "--group-text-color": group.textColor,
            } as React.CSSProperties
          }
        >
          {group.name}
        </div>
      ))}
    </div>
  );
}
