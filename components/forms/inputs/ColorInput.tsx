import { useCallback, useEffect, useRef } from "react";
import {
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import styles from "./inputs.module.css";

type ColorInputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  error?: string;
  fullWidth?: boolean;
  defaultValue?: string;
};

const ColorInput = <T extends FieldValues>({
  register,
  setValue,
  name,
  label,
  required = false,
  error,
  fullWidth = false,
  defaultValue,
}: ColorInputProps<T>) => {
  const textInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const initializedRef = useRef(false);

  const inputId = `color-${name}`;
  const textInputId = `color-text-${name}`;

  // Initialize text input and color picker with default value
  useEffect(() => {
    if (!initializedRef.current && defaultValue) {
      if (textInputRef.current) {
        textInputRef.current.value = defaultValue;
      }
      if (colorInputRef.current) {
        colorInputRef.current.value = defaultValue;
      }
      initializedRef.current = true;
    }
  }, [defaultValue]);

  // Sync color picker when text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexValue = e.target.value.trim();
    // Validate hex color format
    if (/^#[0-9A-Fa-f]{6}$/.test(hexValue)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(name, hexValue as any, { shouldValidate: true });
      if (colorInputRef.current) {
        colorInputRef.current.value = hexValue;
      }
    }
  };

  // Sync text input when color picker changes
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexValue = e.target.value;
    if (textInputRef.current) {
      textInputRef.current.value = hexValue;
    }
  };

  const {
    onChange,
    ref: registerRef,
    ...registerProps
  } = register(name, {
    required: required ? "This field is required" : false,
    validate: required
      ? (value) => {
          const trimmed = value?.trim();
          if (!trimmed || trimmed === "" || trimmed === "#000000") {
            return "This field is required";
          }
          return true;
        }
      : undefined,
  });

  // Handle ref callback
  const handleColorRef = useCallback(
    (element: HTMLInputElement | null) => {
      colorInputRef.current = element;
      if (registerRef) {
        if (typeof registerRef === "function") {
          registerRef(element);
        }
      }
    },
    [registerRef]
  );

  return (
    <div
      className={styles.colorInput}
      style={{ width: fullWidth ? "100%" : "" }}
    >
      <label htmlFor={inputId}>{label}</label>
      <div className={styles.colorInputContainer}>
        <input
          ref={textInputRef}
          id={textInputId}
          type="text"
          placeholder="#000000"
          onChange={handleTextChange}
          className={`${styles.colorTextInput} ${error ? styles.error : ""}`}
        />
        <input
          {...registerProps}
          ref={handleColorRef}
          id={inputId}
          type="color"
          onChange={(e) => {
            onChange(e);
            handleColorChange(e);
          }}
          className={error ? styles.error : ""}
        />
      </div>
      {<span className={styles.errorMessage}>{error || " "}</span>}
    </div>
  );
};

export default ColorInput;
