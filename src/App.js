import React from "react";
import { Graph } from "react-d3-graph";
import NumericInput from "react-numeric-input";
import { graphConfig } from "./configs.js";

import "./App.css";

function randomIntInRange(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 7,
      k: parseInt((7 * (7 - 1)) / 4),
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

  generateGraph = event => {
    // Storing local copies
    let n = this.state.n;
    let k = this.state.k;

    // Arrays to hold nodes and edge connection objects.
    let nodes = [];
    let links = [];

    // Dict for each node, showing all nodes it's connected to.
    let nodeConnections = {};

    // Generate nodes from 0 to n-1, push onto array.
    for (let i = 0; i < n; i++) {
      nodes.push({ id: i });
      nodeConnections[i] = [];
    }

    // Generate connections...
    for (let i = 0; i < k; i++) {
      let source = randomIntInRange(0, n - 1);
      console.log("Source: " + source);
      let target;
      do {
        target = randomIntInRange(0, n - 1);
        console.log("Target: " + target);
      } while (
        target === source ||
        Object.values(nodeConnections[source]).indexOf(target) > -1 ||
        Object.values(nodeConnections[target]).indexOf(source) > -1 ||
        nodeConnections[source].length !== n - 1 ||
        nodeConnections[target].length !== n - 1
      ); // To ensure no self-connections or double connections

      nodeConnections[source].push(target);
      links.push({ source: source, target: target });
    }
    console.log(links);
    let data = {
      nodes,
      links
    };

    this.setState({ data, nodeConnections });
  };

  componentWillMount() {
    this.generateGraph(0);
  }

  render() {
    console.log(this.state);
    if (this.state.data.nodes.length > 0) {
      return (
        <div className="App">
          <Graph id="graph-id" data={this.state.data} config={graphConfig} />
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
            <button onClick={this.generateGraph}>Generate Graph</button>
          </div>
        </div>
      );
    } else {
      return (
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
          <button onClick={this.generateGraph}>Generate Graph</button>
        </div>
      );
    }
  }
}

export default App;
