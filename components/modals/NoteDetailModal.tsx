"use client";

import { Note } from "@/components/types";
import { formatDate } from "@/lib/utils";
import { LinkIcon, PencilSimpleLineIcon } from "@phosphor-icons/react";
import styles from "./NoteDetailModal.module.css";

type NoteDetailModalProps = {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (note: Note) => void;
};

export default function NoteDetailModal({
  note,
  isOpen,
  onClose,
  onEdit,
}: NoteDetailModalProps) {
  if (!isOpen || !note) return null;

  const handleEdit = () => {
    onEdit(note);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <img src={note.imageUrl} alt={note.name} className={styles.image} />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.name}>{note.name}</h2>
            {note.link && (
              <div className={styles.linkContainer}>
                <LinkIcon size={20} />
                <a
                  href={note.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {note.link}
                </a>
              </div>
            )}
            <p className={styles.description}>{note.description || ""}</p>
            <div className={styles.footer}>
              {note.createdAt && (
                <p className={styles.date}>{formatDate(note.createdAt)}</p>
              )}
              <button onClick={handleEdit} className={styles.editButton}>
                <PencilSimpleLineIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
