"use client";

import { useEffect } from "react";
import styles from "./Snackbar.module.css";

type SnackbarProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

export default function Snackbar({
  message,
  onClose,
  duration = 3000,
}: SnackbarProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={styles.snackbar}>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
