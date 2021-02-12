import { padNumber } from "../Utils/Utils";
import styles from "./DigitalCounter.module.css";

export default function DigitalCounter(props) {
  const { number } = props;
  const paddedNumber = padNumber(number, 3);
  return (
    <div {...props} className={styles.digital_counter}>
      {paddedNumber}
    </div>
  );
}
