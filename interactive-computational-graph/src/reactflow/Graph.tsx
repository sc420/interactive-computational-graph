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
  onConnect: OnConnect;
  onDropNode: (nodeType: string, position: XYPosition) => void;
}

const Graph: FunctionComponent<GraphProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDropNode,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const onInit: OnInit = useCallback((reactFlowInstance: ReactFlowInstance) => {
    setReactFlowInstance(reactFlowInstance);
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

      onDropNode(type, position);
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
  );
};

export default Graph;
