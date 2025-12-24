"use client";

import Loader from "@/components/ui/Loader";
import { signIn } from "next-auth/react";
import { useState } from "react";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn("github");
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <h1>visual notetaking made easy.</h1>
      <button onClick={handleSignIn} className={styles.button}>
        Get Started
      </button>
    </div>
  );
}
