"use client";

import {
  MagnifyingGlassIcon,
  SignInIcon,
  SignOutIcon,
  StackPlusIcon,
} from "@phosphor-icons/react";
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
      <div className={styles.headerLeft}>
        <button onClick={handleHomeClick} className={styles.homeButton}>
          apatite.
        </button>
      </div>
      <div className={styles.headerRight}>
        {session?.user ? (
          <>
            <button onClick={handleSearchClick} className={styles.button}>
              <MagnifyingGlassIcon className={styles.icon} size={28} />
            </button>
            <button onClick={handleCreateClick} className={styles.button}>
              <StackPlusIcon className={styles.icon} size={28} />
            </button>
            <button onClick={handleSignOut} className={styles.button}>
              <SignOutIcon className={styles.icon} size={28} />
            </button>
          </>
        ) : (
          <button onClick={handleSignIn} className={styles.button}>
            <SignInIcon className={styles.icon} size={28} />
          </button>
        )}
      </div>
    </header>
  );
}
