# Examples

These examples are embedded in `src/components/WelcomeDialog.tsx`.

## How To Align Positions

Add the following properties to the `ReactFlow` in `src/reactflow/ReactFlowGraph.tsx` to align the nodes to the grid so that the positions in the JSON files look good:

```tsx
        <ReactFlow
          snapToGrid
          snapGrid={[100, 100]}
        >
```
