"use client";

import FormModal from "@/components/ui/FormModal";
import Snackbar from "@/components/ui/Snackbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddNoteForm from "./AddNoteForm";
import styles from "./BoardDetail.module.css";
import NoteDetailModal from "./NoteDetailModal";
import NoteImage from "./NoteImage";

type Note = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  link: string | null;
};

type Board = {
  id: string;
  name: string;
  description: string | null;
  notes: Note[];
  group: {
    id: string;
    name: string;
  };
};

type BoardDetailProps = {
  board: Board;
};

export default function BoardDetail({ board }: BoardDetailProps) {
  const router = useRouter();
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleReturnToGroup = () => {
    router.push(`/group/${board.group.id}`);
  };

  const handleEditBoard = () => {
    router.push(`/edit/${board.id}`);
  };

  const handleAddNote = () => {
    setShowAddNoteModal(true);
  };

  const handleNoteCreated = () => {
    setShowAddNoteModal(false);
    setShowSuccess(true);
    // Refresh the page to show the new note
    router.refresh();
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonRow}>
        <button onClick={handleReturnToGroup} className={styles.returnButton}>
          Return to {board.group.name}
        </button>
        <button onClick={handleEditBoard} className={styles.editButton}>
          edit board
        </button>
        <button onClick={handleAddNote} className={styles.addNoteButton}>
          add a note
        </button>
      </div>
      <h1 className={styles.title}>{board.name}</h1>
      {board.description && (
        <p className={styles.description}>{board.description}</p>
      )}
      <div className={styles.notesContainer}>
        {board.notes.map((note) => (
          <div
            key={note.id}
            onClick={() => handleNoteClick(note)}
            className={styles.noteWrapper}
          >
            <NoteImage imageUrl={note.imageUrl} />
          </div>
        ))}
      </div>
      <FormModal
        isOpen={showAddNoteModal}
        title="Add a Note"
        onClose={() => setShowAddNoteModal(false)}
      >
        <AddNoteForm
          boardId={board.id}
          onCancel={() => setShowAddNoteModal(false)}
          onSuccess={handleNoteCreated}
        />
      </FormModal>
      {showSuccess && (
        <Snackbar
          message="Note created successfully!"
          onClose={() => setShowSuccess(false)}
          duration={2000}
        />
      )}
      <NoteDetailModal
        note={selectedNote}
        isOpen={selectedNote !== null}
        onClose={() => setSelectedNote(null)}
      />
    </div>
  );
}
