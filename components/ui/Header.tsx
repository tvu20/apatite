"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import styles from "./Header.module.css";
import Loader from "./Loader";

export default function Header() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn("github");
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
  };

  if (status === "loading" || isLoading) {
    return <Loader />;
  }

  return (
    <header className={styles.header}>
      {session?.user ? (
        <button onClick={handleSignOut} className={styles.button}>
          log out
        </button>
      ) : (
        <button onClick={handleSignIn} className={styles.button}>
          login
        </button>
      )}
    </header>
  );
}
