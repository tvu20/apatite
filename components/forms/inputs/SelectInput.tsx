import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import styles from "./inputs.module.css";
type SelectInputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
  label: string;
  children: React.ReactNode;
  width?: string;
  required?: boolean;
  error?: string;
};

const SelectInput = <T extends FieldValues>({
  register,
  name,
  label,
  children,
  width,
  required,
  error,
}: SelectInputProps<T>) => {
  return (
    <div className={styles.selectInput}>
      <label htmlFor={name}>{label}</label>
      <select
        {...register(name, {
          required: required ? "This field is required" : false,
        })}
        style={{ width }}
      >
        {children}
      </select>
      {<span className={styles.errorMessage}>{error || " "}</span>}
    </div>
  );
};

export default SelectInput;
