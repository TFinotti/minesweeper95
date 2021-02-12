import { range } from "lodash";
import { createStore } from "redux";
import minesweeperReducer from "./MinesweeperReducer";

export const initialWidth = 16;
export const initialHeight = 16;
export const initialMines = 40;

// create a redux store with using minesweeper reducer and an initial state generated from passed options
export function getMinesweeperStore({ width, height, mineCount }) {
  const initialState = {
    width,
    height,
    mineCount,
    minesPlaced: false,
    lost: false,
    won: false,
    startTime: null, // starts when the first cell is clicked
    endTime: null, // set when won/lost
    grid: range(0, height).map((y) =>
      range(0, width).map((x) => {
        // create a 2d grid of cells
        return {
          id: `cell-${x}-${y}`,
          x,
          y,
          flagged: false,
          mine: false,
          revealed: false,
        };
      })
    ),
  };
  return createStore((state = initialState, action = {}) =>
    minesweeperReducer(state, action)
  );
}

export const store = getMinesweeperStore({
  width: initialWidth,
  height: initialHeight,
  mineCount: initialMines,
});
