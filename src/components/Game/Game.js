import React, { Component } from "react";
import { flatten } from "lodash";
import { PopBox } from "../Utils/Utils";
import { helpers } from "../Helpers";
import { Minefield, MinefieldRow } from "../Minefield/Minefield";
import { MineCell, CellContent } from "../MineCell/MineCell";
import DigitalCounter from "../DigitalCounter/DigitalCounter";
import styles from "./Game.module.css";

export default class Game extends Component {
  componentWillUnmount() {
    this.stopTimer();
  }

  componentWillReceiveProps(nextProps) {
    const { minesPlaced, won, lost } = this.props;

    if (!minesPlaced && nextProps.minesPlaced) {
      this.startTimer();
    }
    if ((!won && nextProps.won) || (!lost && nextProps.lost)) {
      clearInterval(this.timer);
      this.stopTimer();
    }
  }

  startTimer() {
    this.timer = setInterval(() => this.forceUpdate(), 500);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  onCellMouseUp(cell, event) {
    event.preventDefault();
    const { store } = this.props;
    // eslint-disable-next-line default-case
    switch (event.nativeEvent.which) {
      case 1:
        store.dispatch({
          type: "REVEAL_CELL",
          cellId: cell.id,
        });
        break;
      case 2:
        store.dispatch({
          type: "REVEAL_AROUND_CELL",
          cellId: cell.id,
        });
        break;
    }
    return false;
  }

  onCellMouseDown(cell, event) {
    event.preventDefault();
    if (event.nativeEvent.which === 3) {
      const { store } = this.props;
      store.dispatch({
        type: "FLAG_CELL",
        cellId: cell.id,
      });
    }
  }

  onContextMenu(event) {
    event.preventDefault();
    return false;
  }

  render() {
    const {
      grid,
      won,
      lost,
      mineCount,
      startTime,
      endTime,
      onReset,
    } = this.props;
    const flagCount = flatten(grid).filter((c) => c.flagged).length;
    const now = Date.now();

    return (
      <PopBox className={styles.game}>
        <PopBox className={styles.game_info} inset>
          <DigitalCounter number={mineCount - flagCount} />
          <button className={styles.game_win_label} onClick={onReset}>
            {won ? "You Won!" : lost ? "You Lost..." : "Reset"}
          </button>
          <DigitalCounter
            number={
              startTime
                ? Math.floor(((won || lost ? endTime : now) - startTime) / 1000)
                : 0
            }
          />
        </PopBox>

        <Minefield>
          {grid.map((row, i) => (
            <MinefieldRow key={`row-${i}`}>
              {row.map((cell) => (
                <MineCell
                  {...cell}
                  key={cell.id}
                  revealed={
                    cell.revealed ||
                    ((won || lost) && !cell.flagged && cell.mine)
                  }
                  onMouseDown={this.onCellMouseDown.bind(this, cell)}
                  onMouseUp={this.onCellMouseUp.bind(this, cell)}
                  // eslint-disable-next-line no-sequences
                  onContextMenu={this.onContextMenu.bind(this)}
                >
                  <CellContent
                    {...cell}
                    borderMineCount={helpers.countMinesAround(
                      this.props,
                      cell.id
                    )}
                  />
                </MineCell>
              ))}
            </MinefieldRow>
          ))}
        </Minefield>
      </PopBox>
    );
  }
}
