"use client";

import { useState } from "react";
import TextAreaInput from "@/components/forms/inputs/TextAreaInput";
import TextInput from "@/components/forms/inputs/TextInput";
import Loader from "@/components/ui/Loader";
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
  onCancel: () => void;
  onSuccess: () => void;
};

export default function AddNoteForm({
  boardId,
  onCancel,
  onSuccess,
}: AddNoteFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          imageUrl: data.imageUrl,
          link: data.link,
          description: data.description,
          boardId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error creating note:", error);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating note:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
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
      />
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
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button type="submit" className={styles.createButton}>
          Create
        </button>
      </div>
    </form>
  );
}

