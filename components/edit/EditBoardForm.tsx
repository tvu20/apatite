"use client";

import SelectInput from "@/components/forms/inputs/SelectInput";
import TextAreaInput from "@/components/forms/inputs/TextAreaInput";
import TextInput from "@/components/forms/inputs/TextInput";
import { Board } from "@/components/types";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Loader from "@/components/ui/Loader";
import Snackbar from "@/components/ui/Snackbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./EditBoardForm.module.css";

type Group = {
  id: string;
  name: string;
};

type FormData = {
  name: string;
  description: string;
  group: string;
};

type EditBoardFormProps = {
  board: Board;
  groups: Group[];
};

export default function EditBoardForm({ board, groups }: EditBoardFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: board.name,
      description: board.description || "",
      group: board.group?.id,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/boards/${board.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          groupId: data.group,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error updating board:", error);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/board/${board.id}`);
      }, 1000);
    } catch (error) {
      console.error("Error updating board:", error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/board/${board.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/boards/${board.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error deleting board:", error);
        setIsDeleting(false);
        setShowDeleteModal(false);
        return;
      }

      setIsDeleting(false);
      setShowDeleteModal(false);
      router.push("/");
    } catch (error) {
      console.error("Error deleting board:", error);
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
        <TextAreaInput
          register={register}
          name="description"
          label="Description"
          width="100%"
          error={errors.description?.message}
        />
        <SelectInput
          register={register}
          name="group"
          label="Group"
          required
          error={errors.group?.message}
        >
          <option value="">Select a group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </SelectInput>
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className={styles.deleteButton}
          >
            Delete
          </button>
          <div className={styles.rightButtons}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.updateButton}>
              Update
            </button>
          </div>
        </div>
      </form>
      {showSuccess && (
        <Snackbar
          message="Board updated successfully!"
          onClose={() => setShowSuccess(false)}
          duration={2000}
        />
      )}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Board"
        message="Are you sure you want to delete this board? This action cannot be undone and will also delete all notes in this board."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
