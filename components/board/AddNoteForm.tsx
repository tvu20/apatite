"use client";

import TextAreaInput from "@/components/forms/inputs/TextAreaInput";
import TextInput from "@/components/forms/inputs/TextInput";
import { Note } from "@/components/types";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Loader from "@/components/ui/Loader";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./AddNoteForm.module.css";

type FormData = {
  name: string;
  imageUrl: string;
  link: string;
  description: string;
};

type AddNoteFormProps = {
  boardId: string;
  note?: Note | null;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function AddNoteForm({
  boardId,
  note,
  onCancel,
  onSuccess,
}: AddNoteFormProps) {
  const isEditing = !!note;
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(note?.imageUrl || "");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: note
      ? {
          name: note.name,
          imageUrl: note.imageUrl,
          link: note.link || "",
          description: note.description || "",
        }
      : undefined,
  });

  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url || url.trim() === "") return false;
    try {
      // Try to validate as-is first
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      // If that fails, try adding https:// prefix
      try {
        const urlWithProtocol = `https://${url.trim()}`;
        const urlObj = new URL(urlWithProtocol);
        return urlObj.protocol === "https:";
      } catch {
        return false;
      }
    }
  };

  const getImageUrlForPreview = (url: string | undefined): string => {
    if (!url || url.trim() === "") return "";
    try {
      new URL(url);
      return url; // Already a valid URL
    } catch {
      // Try adding https:// prefix
      return `https://${url.trim()}`;
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/notes/${note.id}` : "/api/notes";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          imageUrl: data.imageUrl,
          link: data.link,
          description: data.description,
          ...(isEditing ? {} : { boardId }),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(
          `Error ${isEditing ? "updating" : "creating"} note:`,
          error
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onSuccess();
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} note:`,
        error
      );
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!note) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error deleting note:", error);
        setIsDeleting(false);
        setShowDeleteModal(false);
        return;
      }

      setIsDeleting(false);
      setShowDeleteModal(false);
      onSuccess();
    } catch (error) {
      console.error("Error deleting note:", error);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading || isDeleting) {
    return <Loader />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <TextInput
          register={register}
          name="name"
          label="Name"
          required
          fullWidth
          error={errors.name?.message}
        />
        <TextInput
          register={register}
          name="imageUrl"
          label="Image URL"
          required
          fullWidth
          error={errors.imageUrl?.message}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {isValidImageUrl(imageUrl) && (
          <div className={styles.imagePreview}>
            <img
              src={getImageUrlForPreview(imageUrl)}
              alt="Preview"
              className={styles.previewImage}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        <TextInput
          register={register}
          name="link"
          label="Link"
          fullWidth
          error={errors.link?.message}
        />
        <TextAreaInput
          register={register}
          name="description"
          label="Description"
          width="100%"
          error={errors.description?.message}
        />
        <div className={styles.buttons}>
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          )}
          <div className={styles.rightButtons}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.createButton}>
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>
      {isEditing && (
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
