import minesweeperActions from "./MinesweeperActions";

function minesweeperReducer(state, action) {
  if (minesweeperActions.hasOwnProperty(action.type)) {
    // checks if handler exists for the action
    return minesweeperActions[action.type](state, action);
  } else {
    console.warn(`Invalid Minesweeper action: "${action.type}" (ignoring)`);
    return state;
  }
}

export default minesweeperReducer;
