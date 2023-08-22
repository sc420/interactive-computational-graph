# GraphContainer.test Documentation

The goal is to check the logic inside the GraphContainer without complex mocking code.

## How It Works With Mock

It relies on the React Flow mock class `src\reactflow\ReactFlowGraphMock.tsx` to simulate the events of the real React Flow graph. Note that the real React Flow graph (`ReactFlowGraph` or `ReactFlow`) isn't technically "mocked" by the testing framework, so it runs together with `ReactFlowGraphMock` in the test environment. Because the real React Flow graph isn't mocked, we can check if the updated nodes and edges passed to it won't cause any problem. `ReactFlowGraphMock` simply fires events that appear to be issued by React Flow by the command of the test class.

We could have used jsdom to simulate edge connecting/disconnecting or node removal events, but it seems React Create App isn't happy about jsdom, so a mock class is used instead.

## How To Get Real React Flow Events Data

Just put `console.log` in `GraphContainer` function like `handleNodesChange`.
