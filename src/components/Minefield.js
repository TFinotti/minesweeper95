import { PopBox } from "./Utils";

export function Minefield(props) {
  return <PopBox {...props} className="minefield" inset />;
}

export function MinefieldRow(props) {
  return <div {...props} className="minefield-row" />;
}
