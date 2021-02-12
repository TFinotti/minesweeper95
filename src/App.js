import React, { Component } from "react";
import { store } from "./components/MinesweeperStore";
import Game from "./components/Game/Game";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.store = store;
    this.state = {
      width: store.width,
      height: store.height,
      mineCount: store.mineCount,
      storeState: store.getState(),
    };

    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
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

  reset() {
    this.setState({
      width: store.width,
      height: store.height,
      mineCount: store.mineCount,
      storeState: store.getState(),
    });
  }

  render() {
    const { storeState } = this.state;
    return (
      <div>
        <div className="app-container">
          <Game {...storeState} store={this.store} onReset={this.reset} />
        </div>
        <div className="app-controls">
          <button onClick={this.reset}>Start</button>
        </div>
      </div>
    );
  }
}

export default App;
