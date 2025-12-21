import styles from "./BoardCard.module.css";

type Board = {
  id: string;
  name: string;
  notes: Array<{ id: string; imageUrl: string }>;
  _count: { notes: number };
};

type BoardCardProps = {
  board: Board;
};

export default function BoardCard({ board }: BoardCardProps) {
  const firstNoteImage = board.notes[0]?.imageUrl || null;
  const notesCount = board._count.notes;

  return (
    <div className={styles.card}>
      {firstNoteImage && (
        <img src={firstNoteImage} alt="" className={styles.image} />
      )}
      <div className={styles.content}>
        <h2 className={styles.name}>{board.name}</h2>
        <p className={styles.count}>
          {notesCount} note{notesCount !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
