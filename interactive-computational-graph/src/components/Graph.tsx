import { Box, Button } from "@mui/material";
import { useCallback, useState, type FunctionComponent } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "Hello" },
    position: { x: 0, y: 0 },
    type: "input",
  },
  {
    id: "2",
    data: { label: "World" },
    position: { x: 100, y: 100 },
  },
];

const initialEdges: Edge[] = [];

const Graph: FunctionComponent = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect: OnConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const handleAddNode = (): void => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      data: { label: `New ${nodes.length + 1}` },
      position: { x: 200, y: 200 },
      type: "default",
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // TODO(sc420): Remove the "Add Node" Button
  return (
    <>
      <Button
        variant="contained"
        onClick={handleAddNode}
        sx={{ width: 100, height: 50 }}
      >
        Add Node
      </Button>
      <Box
        display="flex"
        flexGrow={1}
        sx={{
          "> *": { flexGrow: 1 },
        }}
      >
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </Box>
    </>
  );
};

export default Graph;
