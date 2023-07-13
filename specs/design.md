# Design Specs

## React Components

- `Title`: Contains title & GitHub link, no states needed
- `MainContainer`: Contains the main features and graph, has a state `graphData` which is read/updated by both the child components
    - `FeatureContainer`: Contains the features, has a state `selectedFeature` which is updated by `FeatureNavigator` and read by `FeaturePanel`
        - `FeatureNavigator`: Clicks different icons/texts to switch different panels to show (e.g., add nodes, view nodes)
        - `FeaturePanel`: Shows the panel of the currently selected feature on `NavigationBar`
    - `GraphContainer`: Contains the graph stuff, has a state `graphOptions` which is updated by `GraphControl` and read by `Graph`
        - `GraphControl`: Controls the graph behavior (e.g., differentiation mode, differentiation target)
        - `Graph`: Renders the computational graph

## Graph Models

- `GraphNode`: The node information
    - `GraphNode.id`: Unique ID of the node
    - `GraphNode.value`: The value of the node
    - `GraphNode.inputPorts` (List of `Port`): List of input ports
    - `GraphNode.outputPort`: A single output port
    - `GraphNode.portToNodes` (Hash map from port name to list of `Node`): Port to list of connected nodes
    - `GraphNode.f` (function): How to calculate the output $ f() $ given the connected edges
    - `GraphNode.derivativeFOverDerivativeY` (function): How to calculate the partial derivative $ \partial{f}/\partial{y} $ given the connected nodes
    - `GraphNode.derivativeResult`: The previously calculated derivative result with regard to the current differentiation target
- `Port`: The input/output port information
    - `Port.name`: The name of the port, useful for calculating differentiation (e.g., `x`, `n`) especially when the order of the variables is important (e.g., $ x^n $)
    - `Port.allowMultiEdges`: Whether to allow multiple edges to connect to the input port, should be set to true for some operations (e.g., sum)

## Graph Events

- When a node is created:
    - If it's the only node in the graph, force the differentiation target to this node
    - Initialize the value (`GraphNode.value`) to 0
    - Initialize the derivative result (`GraphNode.derivativeResult`) to 0
- When an edge is connected/disconnected from node A to node B:
    1. Update all connected node values recursively from node B (call `GraphNode.f`). In case of disconnection, it should propagate NaN
    2. Update all derivative results from the differentiation target node
- When a variable value changes:
    1. Update all connected node values recursively from the output port of the current node (call `GraphNode.f`)
    2. Update all derivative results from the differentiation target node
- When the differentiation target changes:
    - Forward-mode: Update all connected node derivatives recursively from the output port of the target node (call `GraphNode.derivativeFOverDerivativeY`)
    - Reverse-mode: Update all connected node derivatives recursively from the input port of the target node (call `GraphNode.derivativeFOverDerivativeY`)
    - Update all other unaffected node derivatives to 0
    - Update the derivative result (`GraphNode.derivativeResult`) of itself to 1 since $ \partial{x}/\partial{x} = 1 $

### Optimization

We may not need to update the derivative results after a node value changes or an edge is connected/disconnected. For example, In forward-mode differentiation, when a node value B changes, one of its connected ancestor node is A. Suppose the target is any node on the path from A to B, we only need to update the derivative results from node B because the values on the path have not changed.

## Graph Update Algorithms

- Update all connected node values recursively from node A:
    1. Create a queue
    2. Push node A to the queue
    3. While the queue is not empty
        1. Pop a node X from the queue
        2. Set `X.value` to `GraphNode.f()`
        3. Push all output nodes of X to the queue
- Update all connected node derivatives recursively from the output port of the target node:
    - Forward-mode:
        1. Create a queue
        2. Push the target node T to the queue
        3. While the queue is not empty
            1. Pop a node X from the queue
            2. Set `X.derivativeResult` to `X.derivativeFOverDerivativeY(T)`
            3. Push all output nodes of X to the queue
    - Reverse-mode:
        1. Create a queue
        2. Push the target node T to the queue
        3. While the queue is not empty
            1. Pop a node X from the queue
            2. Set `X.derivativeResult` to the sum of the following:
                - For each output node Z of X, calculate `Z.derivativeFOverDerivativeY(X) * Z.derivativeResult`
            3. Push all input nodes of X to the queue

## Example Node Algorithms

See [./example_node_algorithms.ts](./example_node_algorithms.ts).
