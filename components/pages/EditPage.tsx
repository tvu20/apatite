import { Board } from "@/components/types";
import EditBoardForm from "@/components/forms/EditBoardForm";
import styles from "./EditPage.module.css";

type Group = {
  id: string;
  name: string;
};

type EditPageProps = {
  board: Board;
  groups: Group[];
};

export default function EditPage({ board, groups }: EditPageProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>edit a board</h1>
      <EditBoardForm board={board} groups={groups} />
    </div>
  );
}

