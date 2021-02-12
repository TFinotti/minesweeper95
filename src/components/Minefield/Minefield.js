import { PopBox } from "../Utils/Utils";
import styles from "./Minefield.module.css";

export function Minefield(props) {
  return <PopBox {...props} className={styles.minefield} inset />;
}

export function MinefieldRow(props) {
  return <div {...props} className={styles.minefield_row} />;
}
