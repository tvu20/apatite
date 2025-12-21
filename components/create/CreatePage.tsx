import CreateBoardForm from "./CreateBoardForm";
import styles from "./CreatePage.module.css";

type Group = {
  id: string;
  name: string;
};

type CreatePageProps = {
  groups: Group[];
};

export default function CreatePage({ groups }: CreatePageProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>create a board</h1>
      <CreateBoardForm groups={groups} />
    </div>
  );
}
