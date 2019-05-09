import React from "react";
import { Graph } from "react-d3-graph";
import NumericInput from "react-numeric-input";
import { baseGraphConfig } from "./configs.js";

import "./App.css";

const START_VAL = 36;

function randomIntInRange(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: START_VAL,
      k: parseInt((START_VAL * (START_VAL - 1)) / 20),
      maxEdges: parseInt((START_VAL * (START_VAL - 1)) / 2),
      data: {
        nodes: [],
        links: []
      },
      nodeConnections: [],
      graphConfig: baseGraphConfig
    };
  }

  setNodesCount = newNum => {
    //console.log(newNum);
    let maxEdges = (newNum * (newNum - 1)) / 2;
    this.setState({ n: newNum, maxEdges });
    if (this.state.k > maxEdges) {
      //console.log("New k: " + maxEdges);
      this.setState({ k: maxEdges });
    }
  };

  setEdgeCount = newNum => {
    //console.log("New K: " + newNum);
    this.setState({ k: newNum });
  };

  generateGraph = () => {
    // Storing local copies
    let n = this.state.n;
    let k = this.state.k;

    // Arrays to hold nodes and edge connection objects.
    let nodes = [];
    let links = [];

    // Dict for each node, showing all nodes it's connected to.
    let nodeConnections = [];

    // Generate nodes from 0 to n-1, push onto array.
    for (let i = 0; i < n; i++) {
      nodes.push({ id: i });
      nodeConnections[i] = [];
    }

    // Generate edges...
    for (let i = 0; i < k; i++) {
      let source;
      do {
        source = randomIntInRange(0, n - 1);
      } while (nodeConnections[source].length === n - 1);
      //console.log("Source: " + source);
      let target;
      do {
        // Loops until valid target is found.
        target = randomIntInRange(0, n - 1);
      } while (
        target === source ||
        nodeConnections[target].length === n - 1 ||
        nodeConnections[source].indexOf(target) > -1
      ); // To ensure no self-connections or double connections

      nodeConnections[source].push(parseInt(target));
      nodeConnections[target].push(parseInt(source));
      links.push({ source: source, target: target });
    }
    let data = {
      nodes,
      links
    };

    this.setState({ data, nodeConnections });
  };

  checkForCycle = (source, target) => {
    this.setState({ loading: true });
    //console.log("In check for cycle: " + source);
    //console.log("Target is " + target);
    let queue = [];
    let visited = {};
    visited[source] = true;
    queue.push(source);

    while (queue.length !== 0) {
      let next = queue.shift();
      visited[next] = true;
      for (let node of this.state.nodeConnections[next]) {
        //console.log("Checking node " + next);
        if (!visited[node]) {
          if (node === target) {
            //console.log(`${source} to ${target} would make a cycle.`);
            return true;
          } else {
            queue.push(node);
          }
        }
      }
    }
    return false;
  };

  addEdge = source => {
    if (this.state.nodeConnections[source].length === this.state.n - 1) {
      alert("No more edges can be connected.");
      return;
    }

    let target;
    let checked = [];
    for (let i = 0; i < this.state.n; i++) {
      checked[i] = false;
    }
    checked[source] = true;

    do {
      if (
        checked.every(item => {
          return item === true;
        })
      ) {
        alert(
          "Unable to make another edge, doing so would create a new cycle."
        );
        return;
      }
      target = randomIntInRange(0, this.state.n - 1);
      checked[target] = true;
    } while (
      target == parseInt(source) ||
      this.state.nodeConnections[target].length === this.state.n - 1 ||
      this.state.nodeConnections[source].indexOf(target) > -1 ||
      this.checkForCycle(source, target)
    );
    let data = this.state.data;
    let nodeConnections = this.state.nodeConnections;
    nodeConnections[source].push(target);
    nodeConnections[target].push(source);
    data.links.push({ source: parseInt(source), target: target });
    this.setState({ data, nodeConnections, k: this.state.k + 1 });
  };

  // Calculate and update size of svg dimensions
  updateDimensions() {
    let currentConfig = this.state.graphConfig;
    currentConfig.width = parseInt(window.innerWidth * 0.95);
    currentConfig.height = parseInt(window.innerHeight * 0.66);
    this.setState({ graphConfig: currentConfig });
  }

  componentWillMount() {
    this.generateGraph();
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    //console.log(this.state);
    if (this.state.data.nodes.length > 0) {
      return (
        <div className="App">
          <div className="App-header">
            <h3 style={{ marginBottom: 0 }}>Multiagent Systems Challenge</h3>
            <h5 style={{ marginBottom: "2em", marginTop: ".75em" }}>
              JP Ramassini
            </h5>
          </div>
          <div
            style={{
              borderRadius: 10,
              boxShadow:
                "0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)",
              margin: "2.5%"
            }}>
            <Graph
              id="graph-id"
              data={this.state.data}
              config={this.state.graphConfig}
              onClickNode={this.addEdge}
            />
          </div>
          <div>
            <label className={"input-label"}>N</label>
            <NumericInput
              min={2}
              max={100}
              value={this.state.n}
              onChange={this.setNodesCount}
              className={"numeric-input"}
            />
            <label className={"input-label"}>K</label>
            <NumericInput
              min={1}
              max={this.state.maxEdges}
              value={this.state.k}
              onChange={this.setEdgeCount}
              className={"numeric-input"}
            />
            <button className={"generate-button"} onClick={this.generateGraph}>
              Generate Graph
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <label className={"input-label"}>N</label>
          <NumericInput
            min={2}
            max={100}
            value={this.state.n}
            onChange={this.setNodesCount}
            className={"numeric-input"}
          />
          <label className={"input-label"}>K</label>
          <NumericInput
            min={1}
            max={this.state.maxEdges}
            value={this.state.k}
            onChange={this.setEdgeCount}
            className={"numeric-input"}
          />
          <button className={"generate-button"} onClick={this.generateGraph}>
            Generate Graph
          </button>
        </div>
      );
    }
  }
}

export default App;
