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
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleReturnToGroup = () => {
    router.push(`/group/${board.group.id}`);
  };

  const handleEditBoard = () => {
    router.push(`/edit/${board.id}`);
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setShowAddNoteModal(true);
  };

  const handleNoteCreated = (isEditing: boolean) => {
    setShowAddNoteModal(false);
    setEditingNote(null);
    setSuccessMessage(
      isEditing ? "Note updated successfully!" : "Note created successfully!"
    );
    setShowSuccess(true);
    // Refresh the page to show the new/updated note
    router.refresh();
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowAddNoteModal(true);
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
        title={editingNote ? "Edit Note" : "Add a Note"}
        onClose={() => {
          setShowAddNoteModal(false);
          setEditingNote(null);
        }}
      >
        <AddNoteForm
          boardId={board.id}
          note={editingNote}
          onCancel={() => {
            setShowAddNoteModal(false);
            setEditingNote(null);
          }}
          onSuccess={() => handleNoteCreated(!!editingNote)}
        />
      </FormModal>
      {showSuccess && (
        <Snackbar
          message={successMessage}
          onClose={() => setShowSuccess(false)}
          duration={2000}
        />
      )}
      <NoteDetailModal
        note={selectedNote}
        isOpen={selectedNote !== null}
        onClose={() => setSelectedNote(null)}
        onEdit={handleEditNote}
      />
    </div>
  );
}
