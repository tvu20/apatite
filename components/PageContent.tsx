import styles from "./PageContent.module.css";

type PageContentProps = {
  children: React.ReactNode;
  title?: string;
};

export default function PageContent({ children, title }: PageContentProps) {
  return (
    <div className={styles.container}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {children}
    </div>
  );
}
