import _ from "lodash";

const { flatten } = _; // lodash

// assigns props to the cell with id
export const assignCell = (state, cellId, props) => {
  const { grid } = state;
  const cell = this.getCell(state, cellId);
  const { x, y } = cell;
  const row = grid[cell.y];
  return {
    // immutable state
    ...state,
    grid: [
      ...grid.slice(0, y),
      [...row.slice(0, x), { ...cell, ...props }, ...row.slice(x + 1)],
      ...grid.slice(y + 1),
    ],
  };
};

// assign props to all cells in cellIds
export const assignCells = (state, cellIds, props) => {
  return {
    ...state,
    grid: state.grid.map((row) =>
      row.map((cell) =>
        cellIds.includes(cell.id) ? { ...cell, ...props } : cell
      )
    ),
  };
};

// get cell by id
export const getCell = (state, cellId) => {
  return flatten(state.grid).find((cell) => cell.id === cellId);
};

// get cell at coordinate x, y
export const getCellAt = (state, { x, y }) => {
  const { grid, width, height } = state;
  if (x >= 0 && y >= 0 && x < width && y < height) {
    return grid[y][x];
  }
  return null;
};

// get cells around cell (where cell.id === cellId)
export const getNeighbors = (state, cellId) => {
  const { grid } = state;
  const { x, y } = this.getCell(state, cellId);
  return [
    this.getCellAt(grid, { x: x - 1, y: y - 1 }), // top left
    this.getCellAt(grid, { x: x, y: y - 1 }), // top
    this.getCellAt(grid, { x: x + 1, y: y - 1 }), // top right

    this.getCellAt(grid, { x: x - 1, y: y }), // left
    this.getCellAt(grid, { x: x + 1, y: y }), // right

    this.getCellAt(grid, { x: x - 1, y: y + 1 }), // bottom left
    this.getCellAt(grid, { x: x, y: y + 1 }), // bottom
    this.getCellAt(grid, { x: x + 1, y: y + 1 }), // bottom right
  ].filter((cell) => !!cell); // remove null cells (if target cell is on an edge)
};

// starting at startCell continuing through its neighbors, finds all cells that touch no mines (returns an array of ids)
// this is required to open large pockets of empty space when a cell is revealed
export const getRevealCells = (state, startCellId, visited = []) => {
  const cell = this.getCell(state, startCellId);
  if (cell.mine) {
    // don't reveal empty cells around mines
    return [startCellId];
  }
  const neighbors = this.getNeighbors(state, startCellId);
  const neighborMines = neighbors.filter((cell) => cell.mine);
  visited.push(startCellId); // keep track of visited mines (passed to recursive calls)

  if (neighborMines.length) {
    // stop if the cell borders a mine (but still reveal it)
    return [startCellId];
  } else {
    const toReveal = neighbors
      .filter((neighbor) => !neighbor.flagged && !visited.includes(neighbor.id)) // unvisited/unflagged neighbors only
      .map((neighbor) => neighbor.id);

    return flatten([
      startCellId,
      ...toReveal.map((cellId) => this.getRevealCells(state, cellId, visited)),
    ]);
  }
};

// returns the number of mines bordering a cell
export const countMinesAround = (state, cellId) => {
  return this.getNeighbors(state, cellId).filter((c) => c.mine).length;
};

// check if you are blown up
export const hasLost = (state) => {
  const cells = flatten(state.grid);
  return cells.some((c) => c.mine && c.revealed);
};

// check if all non-mine cells are revealed
export const hasWon = (state) => {
  const cells = flatten(state.grid);
  const nonMines = cells.filter((c) => !c.mine);
  return nonMines.every((c) => c.revealed);
};
