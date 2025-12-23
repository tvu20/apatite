import EditGroupForm from "./EditGroupForm";
import styles from "./EditGroupPage.module.css";

type Group = {
  id: string;
  name: string;
  description: string | null;
  backgroundColor: string;
  textColor: string;
};

type EditGroupPageProps = {
  group: Group;
};

export default function EditGroupPage({ group }: EditGroupPageProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>edit a group</h1>
      <EditGroupForm group={group} />
    </div>
  );
}
