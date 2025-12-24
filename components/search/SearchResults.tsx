"use client";

import SearchInput from "@/components/forms/inputs/SearchInput";
import { Board } from "@/components/types";
import { useEffect, useState } from "react";
import BoardItem from "./BoardItem";
import styles from "./SearchResults.module.css";

type SearchResultsProps = {
  boards: Board[];
};

export default function SearchResults({ boards }: SearchResultsProps) {
  const [searchText, setSearchText] = useState("");
  const [filteredBoards, setFilteredBoards] = useState(boards);

  // Update filtered boards when boards prop changes
  useEffect(() => {
    setFilteredBoards(boards);
  }, [boards]);

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const handleSearchBlur = () => {
    if (!searchText.trim()) {
      setFilteredBoards(boards);
      return;
    }

    const filtered = boards.filter((board) =>
      board.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredBoards(filtered);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchInput
          value={searchText}
          onChange={handleSearchChange}
          onBlur={handleSearchBlur}
          placeholder="Search boards..."
          fullWidth
        />
      </div>
      <div className={styles.grid}>
        {filteredBoards.map((board) => (
          <BoardItem key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
}
