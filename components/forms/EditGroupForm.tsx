"use client";

import ColorInput from "@/components/forms/inputs/ColorInput";
import TextAreaInput from "@/components/forms/inputs/TextAreaInput";
import TextInput from "@/components/forms/inputs/TextInput";
import { Group } from "@/components/types";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Loader from "@/components/ui/Loader";
import Snackbar from "@/components/ui/Snackbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./EditGroupForm.module.css";

type FormData = {
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
};

type EditGroupFormProps = {
  group: Group;
};

export default function EditGroupForm({ group }: EditGroupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: {
      name: group.name,
      description: group.description || "",
      backgroundColor: group.backgroundColor,
      textColor: group.textColor,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          backgroundColor: data.backgroundColor.trim(),
          textColor: data.textColor.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error updating group:", error);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/group/${group.id}`);
      }, 1000);
    } catch (error) {
      console.error("Error updating group:", error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/group/${group.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error deleting group:", error);
        setIsDeleting(false);
        setShowDeleteModal(false);
        return;
      }

      setIsDeleting(false);
      setShowDeleteModal(false);
      router.push("/");
    } catch (error) {
      console.error("Error deleting group:", error);
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
        <ColorInput
          register={register}
          setValue={setValue}
          name="backgroundColor"
          label="Background Color"
          required
          error={errors.backgroundColor?.message}
          defaultValue={group.backgroundColor}
        />
        <ColorInput
          register={register}
          setValue={setValue}
          name="textColor"
          label="Text Color"
          required
          error={errors.textColor?.message}
          defaultValue={group.textColor}
        />
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
          message="Group updated successfully!"
          onClose={() => setShowSuccess(false)}
          duration={2000}
        />
      )}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Group"
        message="Are you sure you want to delete this group? This action cannot be undone and will also delete all boards and notes in this group."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}

