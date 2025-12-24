import {
  FieldValues,
  Path,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import styles from "./inputs.module.css";
type SelectInputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  name: Path<T>;
  label: string;
  children: React.ReactNode;
  width?: string;
  required?: boolean;
  error?: string;
};

const SelectInput = <T extends FieldValues>({
  register,
  watch,
  name,
  label,
  children,
  width,
  required,
  error,
}: SelectInputProps<T>) => {
  const value = watch(name);
  const isEmpty = value === "";

  return (
    <div className={styles.selectInput}>
      <label htmlFor={name}>{label}</label>
      <select
        {...register(name, {
          required: required ? "This field is required" : false,
          validate: required
            ? (value) => value !== "" || "This field is required"
            : undefined,
        })}
        style={{ width }}
        className={`${error ? styles.error : ""} ${
          isEmpty ? styles.emptySelect : ""
        }`.trim()}
      >
        {children}
      </select>
      {<span className={styles.errorMessage}>{error || " "}</span>}
    </div>
  );
};

export default SelectInput;
