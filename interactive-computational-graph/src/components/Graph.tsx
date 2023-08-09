import { Box } from "@mui/material";
import {
  useCallback,
  useRef,
  useState,
  type DragEvent,
  type FunctionComponent,
} from "react";
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
  type OnInit,
  type OnNodesChange,
  type ReactFlowInstance,
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

let nodeId = 0;

const getNewNodeId = (): string => `node ${nodeId++}`;

const Graph: FunctionComponent = () => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const onInit: OnInit = useCallback((reactFlowInstance: ReactFlowInstance) => {
    setReactFlowInstance(reactFlowInstance);
  }, []);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect: OnConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /**
   * Add a new node when dropping a node from feature panel.
   *
   * Reference: https://reactflow.dev/docs/examples/interaction/drag-and-drop/
   */
  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (reactFlowWrapper.current === null || reactFlowInstance === null) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getNewNodeId(),
        type: "default", // TODO(sc420): pass type instead of default
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  return (
    <>
      <Box
        display="flex"
        flexGrow={1}
        sx={{
          "> *": { flexGrow: 1 },
        }}
      >
        <div ref={reactFlowWrapper}>
          <ReactFlow
            edges={edges}
            nodes={nodes}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onEdgesChange={onEdgesChange}
            onInit={onInit}
            onNodesChange={onNodesChange}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </Box>
    </>
  );
};

export default Graph;
