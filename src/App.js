import React, { Component } from "react";
import {
  store,
  getMinesweeperStore,
  initialWidth,
  initialHeight,
  initialMines,
} from "./components/MinesweeperStore";
import Game from "./components/Game/Game";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.store = store;
    this.state = {
      width: initialWidth,
      height: initialHeight,
      mineCount: initialMines,
      storeState: store.getState(),
    };
  }

  componentDidMount() {
    this.subscribe();
  }

  subscribe() {
    this.unsub = this.store.subscribe(() =>
      this.setState({
        storeState: this.store.getState(),
      })
    );
  }

  unsubscribe() {
    if (this.unsub) {
      this.unsub();
      this.unsub = null;
    }
  }

  updateStateInt(key, event) {
    this.setState({ [key]: parseInt(event.target.value) });
  }

  reset() {
    const { width, height, mineCount } = this.state;
    this.unsubscribe();
    this.store = getMinesweeperStore({ width, height, mineCount });
    this.subscribe();
    this.setState({ storeState: this.store.getState() });
  }

  render() {
    const { storeState } = this.state;
    return (
      <div>
        <div className="app-container">
          <Game
            {...storeState}
            store={this.store}
            onReset={this.reset.bind(this)}
          />
        </div>
        <div className="app-controls">
          <div>
            <label>Width</label>
            <input
              type="number"
              value={this.state.width}
              onChange={this.updateStateInt.bind(this, "width")}
              min="0"
              max="50"
            />
          </div>
          <div>
            <label>Height</label>
            <input
              type="number"
              value={this.state.height}
              onChange={this.updateStateInt.bind(this, "height")}
              min="0"
              max="50"
            />
          </div>
          <div>
            <label>Mines</label>
            <input
              type="number"
              value={this.state.mineCount}
              onChange={this.updateStateInt.bind(this, "mineCount")}
              min="0"
              max="2499"
            />
          </div>
          <button onClick={this.reset.bind(this)}>Start</button>
        </div>
      </div>
    );
  }
}

export default App;
