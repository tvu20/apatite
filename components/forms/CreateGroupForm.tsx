"use client";

import ColorInput from "@/components/forms/inputs/ColorInput";
import TextAreaInput from "@/components/forms/inputs/TextAreaInput";
import TextInput from "@/components/forms/inputs/TextInput";
import Loader from "@/components/ui/Loader";
import Snackbar from "@/components/ui/Snackbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./CreateGroupForm.module.css";

type FormData = {
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
};

export default function CreateGroupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const backgroundColor =
        data.backgroundColor?.trim() &&
        data.backgroundColor.trim() !== "" &&
        data.backgroundColor.trim() !== "#000000"
          ? data.backgroundColor.trim()
          : "#c7c7c7";
      const textColor =
        data.textColor?.trim() &&
        data.textColor.trim() !== "" &&
        data.textColor.trim() !== "#000000"
          ? data.textColor.trim()
          : "#5e5e5e";

      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          backgroundColor,
          textColor,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error creating group:", error);
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/group/${result.group.id}`);
      }, 1000);
    } catch (error) {
      console.error("Error creating group:", error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (isLoading) {
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
          error={errors.backgroundColor?.message}
        />
        <ColorInput
          register={register}
          setValue={setValue}
          name="textColor"
          label="Text Color"
          error={errors.textColor?.message}
        />
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" className={styles.createButton}>
            Create
          </button>
        </div>
      </form>
      {showSuccess && (
        <Snackbar
          message="Group created successfully!"
          onClose={() => setShowSuccess(false)}
          duration={2000}
        />
      )}
    </>
  );
}

