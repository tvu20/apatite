import styles from "./NoteImage.module.css";

type NoteImageProps = {
  imageUrl: string;
};

export default function NoteImage({ imageUrl }: NoteImageProps) {
  return (
    <div className={styles.container}>
      <img src={imageUrl} alt="" className={styles.image} />
    </div>
  );
}
