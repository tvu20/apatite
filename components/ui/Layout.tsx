"use client";

import { usePageLoading } from "@/hooks/usePageLoading";
import Header from "./Header";
import styles from "./Layout.module.css";
import Loader from "./Loader";

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
