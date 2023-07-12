# UI Specs

## Components

### Top Area

- Title: Interactive Computational Graph
- Icon: Link to the GitHub project

### Left Area

- Left vertical bar: A list of icons
    - Add nodes: Show a list of nodes to add (e.g., variable, operations)
    - View nodes: Show the list of the current nodes on the graph
    - Neural network builder: Build the nodes by inputting neural network parameters
    - Load from presets: Show a list of built-in computational graphs
    - Load/Save: Either load the graph from a file or save the graph to a file
- Right panel: To show the content for the currently selected icon
    - Add nodes: List of nodes grouped by types (e.g., "Values", "Simple", "Advanced")
    - View nodes: List of nodes on the graph, click to focus the node, has remove icon
    - Neural network builder: Specify number of layers, number of nodes in each layer, activation function, etc.
    - Load from presets: List of built-in computational graphs, click to load
    - Load/Save: Load from a data file, save to a data file, may support other formats like GraphViz/Mermaid

### Right Area

- Top horizontal bar: Has some control buttons
  - Calculation control
    - Toggle mode: Switch between forward/reverse mode differentiation
    - Target dropdown: Choose the differentiation target
    - Precision dropdown: Choose the precision of the calculated values
  - View control
    - Reset the position: Put the whole nodes into the center in case that nodes have disappeared from the screen
    - Zoom in
    - Zoom out
  - Diagram control
    - Reset the diagram: Delete everything in the diagram
- Bottom area: A react-diagrams canvas with variable/operation nodes on it

## Figma Spec

See files under `specs/Figma`.

## References

- [Free Figma course dashboard template - Andrey Lohmatov](https://www.figma.com/file/7SAHIZwPs1VSgBVOAUpwWp/Dashboard?type=design&node-id=0-1&mode=design&t=LAwyws0HO3EP4rLo-0)
