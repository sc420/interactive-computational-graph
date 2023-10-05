# GraphContainer.test Documentation

The goal is to check the logic inside the GraphContainer without complex mocking code.

## How It Works With Helper

It relies on the React Flow helper class `src\reactflow\ReactFlowGraphTestHelper.tsx` to simulate the events of the real React Flow graph. Note that the real React Flow graph (`ReactFlowGraph` or `ReactFlow`) isn't mocked by the testing framework, so it runs together with `ReactFlowGraphTestHelper` in the test environment. Because the real React Flow graph isn't mocked, we can check if the updated nodes and edges passed to it won't cause any problem. `ReactFlowGraphTestHelper` simply fires events that appear to be issued by React Flow by the command of the test class.

We could have used mouse down/up events to simulate edge connecting/disconnecting, but when we tried to mouse down on the React Flow handle, it threw an error `Uncaught [TypeError: u?.elementFromPoint is not a function]`. That's why we use a helper class instead.

## How To Get Real React Flow Events Data

Just put `console.log` in `GraphContainer` function like `handleNodesChange`.
