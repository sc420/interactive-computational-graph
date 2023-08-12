import { Box } from "@mui/material";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type FunctionComponent,
} from "react";
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnInit,
  type OnNodesChange,
  type OnSelectionChangeParams,
  type ReactFlowInstance,
  type XYPosition,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";

interface GraphProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onSelectionChange: (params: OnSelectionChangeParams) => void;
  onConnect: OnConnect;
  onDropNode: (nodeType: string, position: XYPosition) => void;
}

const Graph: FunctionComponent<GraphProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onSelectionChange,
  onConnect,
  onDropNode,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const handleInit: OnInit = useCallback(
    (reactFlowInstance: ReactFlowInstance) => {
      setReactFlowInstance(reactFlowInstance);
    },
    [],
  );

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /**
   * Add a new node when dropping a node from feature panel.
   *
   * Reference: https://reactflow.dev/docs/examples/interaction/drag-and-drop/
   */
  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (reactFlowWrapper.current === null || reactFlowInstance === null) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData("application/reactflow");

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      onDropNode(nodeType, position);
    },
    [reactFlowInstance],
  );

  return (
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
          nodeTypes={nodeTypes}
          onInit={handleInit}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onSelectionChange={onSelectionChange}
          onConnect={onConnect}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </Box>
  );
};

export default Graph;
