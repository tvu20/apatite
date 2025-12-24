"use client";

import NoteCard from "@/components/cards/NoteCard";
import AddNoteForm from "@/components/forms/AddNoteForm";
import FormModal from "@/components/modals/FormModal";
import NoteDetailModal from "@/components/modals/NoteDetailModal";
import { Board, Note } from "@/components/types";
import Snackbar from "@/components/ui/Snackbar";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeftIcon,
  PencilSimpleLineIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./BoardDetailPage.module.css";

type BoardDetailPageProps = {
  board: Board;
};

export default function BoardDetailPage({ board }: BoardDetailPageProps) {
  const router = useRouter();
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleReturnToGroup = () => {
    router.push(`/group/${board.group?.id}`);
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
      <button
        onClick={handleReturnToGroup}
        className={styles.backButton}
        style={{
          color: board.group?.textColor || "#333333",
        }}
      >
        <ArrowLeftIcon size={15} />
        back to {board.group?.name}
      </button>
      <div className={styles.header}>
        <h1 className={styles.title}>{board.name}</h1>
        <div className={styles.buttonRow}>
          <button onClick={handleEditBoard} className={styles.editButton}>
            <PencilSimpleLineIcon size={28} />
          </button>
          <button onClick={handleAddNote} className={styles.addNoteButton}>
            <PlusIcon size={28} />
          </button>
        </div>
      </div>
      {board.description && (
        <p className={styles.description}>{board.description}</p>
      )}
      <p className={styles.date}>
        {board.createdAt ? `Created ${formatDate(board.createdAt)}` : ""}
      </p>
      <div className={styles.notesGrid}>
        {board.notes?.map((note) => (
          <NoteCard
            key={note.id}
            imageUrl={note.imageUrl}
            name={note.name || ""}
            groupTextColor={board.group?.textColor}
            onClick={() => handleNoteClick(note)}
          />
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
