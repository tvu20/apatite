"use client";

import CreateBoardForm from "@/components/forms/CreateBoardForm";
import CreateGroupForm from "@/components/forms/CreateGroupForm";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useState } from "react";
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
      <div className={styles.header}>
        <h1 className={styles.title}>create a</h1>
        <div className={styles.selectContainer}>
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as "board" | "group")
            }
            className={styles.select}
          >
            <option value="board">board</option>
            <option value="group">group</option>
          </select>
          <CaretDownIcon className={styles.selectIcon} size={20} />
        </div>
      </div>
      {selectedType === "board" ? (
        <CreateBoardForm groups={groups} />
      ) : (
        <CreateGroupForm />
      )}
    </div>
  );
}
