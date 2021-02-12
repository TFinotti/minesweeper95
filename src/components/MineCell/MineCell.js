import { classNames, PopBox } from "../Utils/Utils";
import "./MineCell.css";

export function MineCell(props) {
  const { revealed, flagged, mine } = props;
  const className = classNames(
    "mine-cell",
    `mine-cell--${revealed ? "revealed" : "hidden"}`,
    mine ? "mine-cell--mine" : null,
    flagged ? "mine-cell--flagged" : null
  );

  return <PopBox {...props} className={className} revealed={true} />;
}

export function MineCellNumber({ number }) {
  const className = `mine-cell-number mine-cell-number--${number}`;
  return <span className={className}>{number || ""}</span>;
}

export function CellContent({ revealed, mine, borderMineCount }) {
  if (!mine && borderMineCount && revealed) {
    return <MineCellNumber number={borderMineCount} />;
  }
  return null;
}
