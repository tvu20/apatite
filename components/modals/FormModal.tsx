"use client";

import styles from "./FormModal.module.css";

type FormModalProps = {
  isOpen: boolean;
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
};

export default function FormModal({ isOpen, title, children }: FormModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
