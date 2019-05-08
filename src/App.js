import React from "react";
import { Graph } from "react-d3-graph";
import NumericInput from "react-numeric-input";
import { graphConfig } from "./configs.js";

import "./App.css";

const data = {
  nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }, { id: "JP" }],
  links: [
    { source: "Harry", target: "Sally" },
    { source: "Harry", target: "Alice" },
    { source: "JP", target: "Alice" }
  ]
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 7,
      k: (7 * (7 - 1)) / 2,
      maxEdges: (7 * (7 - 1)) / 2,
      data: {
        nodes: [],
        links: []
      },
      nodeConnections: {}
    };
    //this.setNodesCount = this.setNodesCount.bind(this);
  }

  setNodesCount = newNum => {
    console.log(newNum);
    let maxEdges = (newNum * (newNum - 1)) / 2;
    this.setState({ n: newNum, maxEdges });
    if (this.state.k > maxEdges) {
      console.log("New k: " + maxEdges);
      this.setState({ k: maxEdges });
    }
  };

  setEdgeCount = newNum => {
    console.log("New K: " + newNum);
    this.setState({ k: newNum });
  };

  render() {
    console.log(this.state);
    if (this.state.data.nodes) {
      return (
        <div className="App">
          <Graph id="graph-id" data={data} config={graphConfig} />
          <div>
            <NumericInput
              min={2}
              max={100}
              value={this.state.n}
              strict
              onChange={this.setNodesCount}
            />
            <NumericInput
              min={1}
              max={this.state.maxEdges}
              value={this.state.k}
              strict
              onChange={this.setEdgeCount}
            />
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default App;
