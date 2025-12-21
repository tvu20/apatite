import BoardItem from "./BoardItem";
import styles from "./SearchResults.module.css";

type Board = {
  id: string;
  name: string;
  notes: Array<{ id: string; imageUrl: string }>;
};

type SearchResultsProps = {
  boards: Board[];
};

export default function SearchResults({ boards }: SearchResultsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {boards.map((board) => (
          <BoardItem key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
}
