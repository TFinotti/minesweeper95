import { flatten } from "lodash";

export const helpers = {
  // assigns props to the cell with id
  assignCell(state, cellId, props) {
    const { grid } = state;
    const cell = this.getCell(state, cellId);
    const { x, y } = cell;
    const row = grid[cell.y];
    return {
      ...state,
      grid: [
        ...grid.slice(0, y),
        [...row.slice(0, x), { ...cell, ...props }, ...row.slice(x + 1)],
        ...grid.slice(y + 1),
      ],
    };
  },

  // assign props to all cells in cellIds
  assignCells(state, cellIds, props) {
    return {
      ...state,
      grid: state.grid.map((row) =>
        row.map((cell) =>
          cellIds.includes(cell.id) ? { ...cell, ...props } : cell
        )
      ),
    };
  },

  // get cell by id
  getCell(state, cellId) {
    return flatten(state.grid).find((cell) => cell.id === cellId);
  },

  // get cell at coordinate x, y
  getCellAt(state, { x, y }) {
    const { grid, width, height } = state;
    if (x >= 0 && y >= 0 && x < width && y < height) {
      return grid[y][x];
    }
    return null;
  },

  // get cells around cell (where cell.id === cellId)
  getNeighbors(state, cellId) {
    const { x, y } = this.getCell(state, cellId);
    return [
      this.getCellAt(state, { x: x - 1, y: y - 1 }), // top left
      this.getCellAt(state, { x: x, y: y - 1 }), // top
      this.getCellAt(state, { x: x + 1, y: y - 1 }), // top right

      this.getCellAt(state, { x: x - 1, y: y }), // left
      this.getCellAt(state, { x: x + 1, y: y }), // right

      this.getCellAt(state, { x: x - 1, y: y + 1 }), // bottom left
      this.getCellAt(state, { x: x, y: y + 1 }), // bottom
      this.getCellAt(state, { x: x + 1, y: y + 1 }), // bottom right
    ].filter((cell) => !!cell); // remove null cells (if target cell is on an edge)
  },

  // starting at startCell continuing through its neighbors, finds all cells that touch no mines (returns an array of ids)
  getRevealCells(state, startCellId, visited = []) {
    const cell = this.getCell(state, startCellId);
    if (cell.mine) {
      return [startCellId];
    }
    const neighbors = this.getNeighbors(state, startCellId);
    const neighborMines = neighbors.filter((cell) => cell.mine);
    visited.push(startCellId);

    if (neighborMines.length) {
      return [startCellId];
    } else {
      const toReveal = neighbors
        .filter(
          (neighbor) => !neighbor.flagged && !visited.includes(neighbor.id)
        )
        .map((neighbor) => neighbor.id);

      return flatten([
        startCellId,
        ...toReveal.map((cellId) =>
          this.getRevealCells(state, cellId, visited)
        ),
      ]);
    }
  },

  // returns the number of mines bordering a cell
  countMinesAround(state, cellId) {
    return this.getNeighbors(state, cellId).filter((c) => c.mine).length;
  },

  // check if you are blown up
  hasLost(state) {
    const cells = flatten(state.grid);
    return cells.some((c) => c.mine && c.revealed);
  },

  // check if all non-mine cells are revealed
  hasWon(state) {
    const cells = flatten(state.grid);
    const nonMines = cells.filter((c) => !c.mine);
    return nonMines.every((c) => c.revealed);
  },
};
