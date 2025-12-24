"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import styles from "./Header.module.css";
import Loader from "./Loader";

export default function Header() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn("github");
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
  };

  const handleHomeClick = () => {
    startTransition(() => {
      router.push("/");
    });
  };

  const handleSearchClick = () => {
    startTransition(() => {
      router.push("/search");
    });
  };

  const handleCreateClick = () => {
    startTransition(() => {
      router.push("/create");
    });
  };

  if (status === "loading" || isLoading || isPending) {
    return <Loader />;
  }

  return (
    <header className={styles.header}>
      <button onClick={handleHomeClick} className={styles.homeButton}>
        apatite
      </button>
      <button onClick={handleSearchClick} className={styles.button}>
        search
      </button>
      <button onClick={handleCreateClick} className={styles.button}>
        create
      </button>
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
