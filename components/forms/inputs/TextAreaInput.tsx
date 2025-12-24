import { FieldValues, Path, UseFormRegister } from "react-hook-form";

import styles from "./inputs.module.css";

type TextAreaInputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  width?: string;
  height?: string;
};

const TextAreaInput = <T extends FieldValues>({
  register,
  name,
  label,
  placeholder,
  required = false,
  error,
  width = "100%",
  height = "",
}: TextAreaInputProps<T>) => {
  return (
    <div className={styles.textAreaInput}>
      <label htmlFor={name}>{label}</label>
      <textarea
        cols={100}
        rows={5}
        wrap="soft"
        id={name}
        style={{ width, height }}
        {...register(name, {
          required: required ? "This field is required" : false,
          setValueAs: (v: string) => v,
        })}
        placeholder={placeholder}
        className={error ? styles.error : ""}
      />
    </div>
  );
};

export default TextAreaInput;
