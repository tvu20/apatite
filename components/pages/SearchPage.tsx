"use client";

import BoardCard from "@/components/cards/BoardCard";
import SearchInput from "@/components/forms/inputs/SearchInput";
import { Board } from "@/components/types";
import { useEffect, useState } from "react";
import styles from "./SearchPage.module.css";

type SearchPageProps = {
  boards: Board[];
};

export default function SearchPage({ boards }: SearchPageProps) {
  const [searchText, setSearchText] = useState("");
  const [filteredBoards, setFilteredBoards] = useState(boards);

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
      <h1>all boards</h1>
      <div className={styles.searchContainer}>
        <SearchInput
          value={searchText}
          onChange={handleSearchChange}
          onBlur={handleSearchBlur}
          placeholder="Search boards"
          fullWidth
        />
      </div>
      <div className="grid">
        {filteredBoards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
}

