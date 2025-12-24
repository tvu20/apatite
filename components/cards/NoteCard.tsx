import styles from "./NoteCard.module.css";

type NoteCardProps = {
  imageUrl: string;
  name: string;
  groupTextColor?: string;
  onClick?: () => void;
};

export default function NoteCard({
  imageUrl,
  name,
  groupTextColor = "#333333",
  onClick,
}: NoteCardProps) {
  return (
    <div
      className={styles.wrapper}
      onClick={onClick}
      style={
        {
          "--group-text-color": groupTextColor,
        } as React.CSSProperties
      }
    >
      <div className={styles.container}>
        <img src={imageUrl} alt="" className={styles.image} />
        <div className={styles.overlay}></div>
        <h3 className={styles.title}>{name}</h3>
      </div>
    </div>
  );
}
