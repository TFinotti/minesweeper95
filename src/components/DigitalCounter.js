import { padNumber } from "./Utils";

export default function DigitalCounter(props) {
  const { number } = props;
  const paddedNumber = padNumber(number, 3);
  return (
    <div {...props} className="digital-counter">
      {paddedNumber}
    </div>
  );
}
