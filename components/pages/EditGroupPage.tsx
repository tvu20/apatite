import { Group } from "@/components/types";
import EditGroupForm from "@/components/forms/EditGroupForm";
import styles from "./EditGroupPage.module.css";

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

