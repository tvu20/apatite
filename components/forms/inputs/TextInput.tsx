import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import styles from "./inputs.module.css";

type TextInputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
  label: string;
  width?: string;
  placeholder?: string;
  type?: "text" | "number";
  required?: boolean;
  error?: string;
  fullWidth?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validate?: (value: string) => string | boolean;
};

const TextInput = <T extends FieldValues>({
  register,
  name,
  label,
  width,
  placeholder,
  type = "text",
  required = false,
  error,
  fullWidth = false,
  onChange,
  validate,
}: TextInputProps<T>) => {
  const inputId = `text-${name}`;
  return (
    <div
      className={styles.textInput}
      style={{ width: fullWidth ? "100%" : "" }}
    >
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        type={type}
        {...register(name, {
          required: required ? "This field is required" : false,
          valueAsNumber: type === "number",
          validate,
        })}
        style={{ width: fullWidth ? "100%" : width }}
        placeholder={placeholder}
        className={error ? styles.error : ""}
        onChange={onChange}
      />
      {<span className={styles.errorMessage}>{error || " "}</span>}
    </div>
  );
};

export default TextInput;
