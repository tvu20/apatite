import styles from "./BoardDetail.module.css";
import NoteImage from "./NoteImage";

type Board = {
  id: string;
  name: string;
  description: string | null;
  notes: Array<{
    id: string;
    imageUrl: string;
  }>;
};

type BoardDetailProps = {
  board: Board;
};

export default function BoardDetail({ board }: BoardDetailProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{board.name}</h1>
      {board.description && (
        <p className={styles.description}>{board.description}</p>
      )}
      <div className={styles.notesContainer}>
        {board.notes.map((note) => (
          <NoteImage key={note.id} imageUrl={note.imageUrl} />
        ))}
      </div>
    </div>
  );
}
