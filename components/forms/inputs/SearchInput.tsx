import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import styles from "./inputs.module.css";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  fullWidth?: boolean;
};

export default function SearchInput({
  value,
  onChange,
  onBlur,
  placeholder = "Search",
  fullWidth = false,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={styles.searchInput}
      style={{ width: fullWidth ? "100%" : "" }}
    >
      <div className={styles.searchInputContainer}>
        <MagnifyingGlassIcon className={styles.searchIcon} size={24} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={styles.searchInputField}
        />
      </div>
    </div>
  );
}
