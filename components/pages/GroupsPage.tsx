"use client";

import GroupCard from "@/components/cards/GroupCard";
import SearchInput from "@/components/forms/inputs/SearchInput";
import { Group } from "@/components/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./GroupsPage.module.css";

type GroupsPageProps = {
  groups: Group[];
};

export default function GroupsPage({ groups }: GroupsPageProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [filteredGroups, setFilteredGroups] = useState(groups);

  useEffect(() => {
    setFilteredGroups(groups);
  }, [groups]);

  const handleGroupClick = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const handleSearchBlur = () => {
    if (!searchText.trim()) {
      setFilteredGroups(groups);
      return;
    }

    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  return (
    <>
      <h1 className={styles.title}>what&apos;s on the menu for today?</h1>
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <SearchInput
            value={searchText}
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
            placeholder="Search groups"
            fullWidth
          />
        </div>
        <div className="grid">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={handleGroupClick}
            />
          ))}
        </div>
      </div>
    </>
  );
}

