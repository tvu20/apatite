"use client";

import { signIn } from "next-auth/react";
import styles from "./LoginButton.module.css";

export default function LoginButton() {
  return (
    <button onClick={() => signIn("github")} className={styles.button}>
      login
    </button>
  );
}
