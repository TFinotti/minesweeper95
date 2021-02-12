import "./Utils.css";

export function PopBox(props) {
  const className = classNames(
    "pop-box",
    props.inset ? "pop-box--inset" : null,
    props.className
  );
  return <div {...props} className={className} />;
}

export function padNumber(n, length) {
  const isNegative = n < 0;
  if (isNegative) {
    n = n * -1;
    length -= 1;
  }
  n = n.toString();
  while (n.length < length) {
    n = "0" + n;
  }
  if (isNegative) {
    n = "-" + n;
  }
  return n;
}

export function classNames(...names) {
  return names.filter((n) => !!n).join(" ");
}
