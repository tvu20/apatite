"use client";

import SelectInput from "@/components/forms/inputs/SelectInput";
import TextAreaInput from "@/components/forms/inputs/TextAreaInput";
import TextInput from "@/components/forms/inputs/TextInput";
import Loader from "@/components/ui/Loader";
import Snackbar from "@/components/ui/Snackbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Group = {
  id: string;
  name: string;
};

type FormData = {
  name: string;
  description: string;
  group: string;
};

type CreateBoardFormProps = {
  groups: Group[];
};

export default function CreateBoardForm({ groups }: CreateBoardFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/boards", {
        method: "POST",
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
        console.error("Error creating board:", error);
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/board/${result.board.id}`);
      }, 1000);
    } catch (error) {
      console.error("Error creating board:", error);
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
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <TextInput
          register={register}
          name="name"
          label="Name"
          required
          fullWidth
          placeholder="Enter board name"
          error={errors.name?.message}
        />
        <TextAreaInput
          register={register}
          name="description"
          label="Description"
          width="100%"
          placeholder="Lorem ipsul dolor"
          error={errors.description?.message}
        />
        <SelectInput
          register={register}
          watch={watch}
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
        <div className="form-buttons">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
          >
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Create
          </button>
        </div>
      </form>
      {showSuccess && (
        <Snackbar
          message="Board created successfully!"
          onClose={() => setShowSuccess(false)}
          duration={2000}
        />
      )}
    </>
  );
}
