"use client";

import styles from "./NoteDetailModal.module.css";

type Note = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  link: string | null;
};

type NoteDetailModalProps = {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function NoteDetailModal({
  note,
  isOpen,
  onClose,
}: NoteDetailModalProps) {
  if (!isOpen || !note) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <img src={note.imageUrl} alt={note.name} className={styles.image} />
          <h2 className={styles.name}>{note.name}</h2>
          {note.description && (
            <p className={styles.description}>{note.description}</p>
          )}
          {note.link && (
            <a
              href={note.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {note.link}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

