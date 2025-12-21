"use client";

import { useState } from "react";
import CreateBoardForm from "./CreateBoardForm";
import CreateGroupForm from "./CreateGroupForm";
import styles from "./CreatePage.module.css";

type Group = {
  id: string;
  name: string;
};

type CreatePageProps = {
  groups: Group[];
};

export default function CreatePage({ groups }: CreatePageProps) {
  const [selectedType, setSelectedType] = useState<"board" | "group">("board");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>create a board</h1>
      <div className={styles.selectContainer}>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as "board" | "group")}
          className={styles.select}
        >
          <option value="board">board</option>
          <option value="group">group</option>
        </select>
      </div>
      {selectedType === "board" ? (
        <CreateBoardForm groups={groups} />
      ) : (
        <CreateGroupForm />
      )}
    </div>
  );
}
