import { helpers } from "./Helpers";
import { flatten, sampleSize } from "lodash";

export const minesweeperActions = {
  "@@redux/INIT"(state) {
    return state;
  },

  FLAG_CELL(state, { cellId }) {
    const cell = helpers.getCell(state, cellId);
    if (cell.revealed) {
      return state;
    } else {
      return helpers.assignCell(state, cellId, {
        flagged: !cell.flagged,
      });
    }
  },

  REVEAL_CELL(state, { cellId }) {
    if (state.won || state.lost || helpers.getCell(state, cellId).flagged) {
      return state;
    }
    if (!state.minesPlaced) {
      state = this.PLACE_MINES(state, { cellIdToAvoid: cellId });
    }
    const toReveal = helpers.getRevealCells(state, cellId);
    const newState = helpers.assignCells(state, toReveal, {
      revealed: true,
      flagged: false,
    });
    const hasLost = helpers.hasLost(newState);
    const hasWon = !hasLost && helpers.hasWon(newState);
    return {
      ...newState,
      won: hasWon,
      lost: hasLost,
      endTime: Date.now(),
    };
  },

  REVEAL_AROUND_CELL(state, { cellId }) {
    const cell = helpers.getCell(state, cellId);
    const neighbors = helpers.getNeighbors(state, cellId);
    const neighborMineCount = neighbors.filter((n) => n.mine).length;
    const neighborFlagCount = neighbors.filter((n) => n.flagged).length;
    if (cell.revealed && neighborMineCount === neighborFlagCount) {
      const nonFlaggedNeighborIds = neighbors
        .filter((n) => !n.flagged)
        .map((n) => n.id);
      return nonFlaggedNeighborIds.reduce(
        (state, cellId) => this.REVEAL_CELL(state, { cellId }),
        state
      );
    }
    return state;
  },

  PLACE_MINES(state, { cellIdToAvoid }) {
    const validCells = flatten(state.grid)
      .filter((c) => c.id !== cellIdToAvoid)
      .map((c) => c.id);
    const mines = sampleSize(validCells, state.mineCount);
    return {
      ...helpers.assignCells(state, mines, { mine: true }),
      minesPlaced: true,
      startTime: Date.now(),
    };
  },
};
