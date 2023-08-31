import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
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
import type FeatureNodeType from "../features/FeatureNodeType";
import CustomNode from "./CustomNode";

interface ReactFlowGraphProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onSelectionChange: (params: OnSelectionChangeParams) => void;
  onConnect: OnConnect;
  onDropNode: (featureNodeType: FeatureNodeType, position: XYPosition) => void;
  isDarkMode: boolean;
}

const ReactFlowGraph: FunctionComponent<ReactFlowGraphProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onSelectionChange,
  onConnect,
  onDropNode,
  isDarkMode,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const style = useMemo(
    () => ({ background: isDarkMode ? grey[900] : "inherit" }),
    [isDarkMode],
  );
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
      const featureNodeTypeJsonData = event.dataTransfer.getData(
        "application/reactflow",
      );
      const featureNodeType = JSON.parse(
        featureNodeTypeJsonData,
      ) as FeatureNodeType;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      onDropNode(featureNodeType, position);
    },
    [onDropNode, reactFlowInstance],
  );

  return (
    <Box
      display="flex"
      flexGrow={1}
      sx={{
        "> div": { flexGrow: 1 },
      }}
    >
      <div ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={handleInit}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onSelectionChange={onSelectionChange}
          onConnect={onConnect}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={style}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </Box>
  );
};

export default ReactFlowGraph;
