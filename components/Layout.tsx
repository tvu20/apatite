"use client";

import { usePageLoading } from "@/hooks/usePageLoading";
import styles from "./Layout.module.css";
import Header from "./ui/Header";
import Loader from "./ui/Loader";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isPageLoading } = usePageLoading();

  if (isPageLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <Header />
      {children}
    </div>
  );
}
