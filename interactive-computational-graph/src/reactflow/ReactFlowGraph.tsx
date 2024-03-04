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
import "./ReactFlowGraph.css";

interface ReactFlowGraphProps {
  nodes: Node[];
  edges: Edge[];
  onInit: OnInit;
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
  onInit,
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
  const deleteKeyCode = useMemo(() => ["Backspace", "Delete"], []);
  const multiSelectionKeyCode = useMemo(() => ["Meta", "Control"], []);
  const zoomActivationKeyCode = useMemo(() => ["Meta", "Control"], []);

  const handleInit: OnInit = useCallback(
    (reactFlowInstance: ReactFlowInstance) => {
      onInit(reactFlowInstance);

      setReactFlowInstance(reactFlowInstance);
    },
    [onInit],
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
      let featureNodeType: FeatureNodeType;
      try {
        featureNodeType = JSON.parse(featureNodeTypeJsonData);
      } catch (error) {
        // Ignore dropping unknown data, e.g., the data would be empty when
        // dragging any selected input text in custom node to the canvas
        return;
      }

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
          // Basic props
          nodes={nodes}
          edges={edges}
          style={style}
          className={isDarkMode ? "dark-mode" : ""}
          nodeTypes={nodeTypes}
          // Event handlers
          onInit={handleInit}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onSelectionChange={onSelectionChange}
          onConnect={onConnect}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          // Keys
          deleteKeyCode={deleteKeyCode}
          multiSelectionKeyCode={multiSelectionKeyCode}
          zoomActivationKeyCode={zoomActivationKeyCode}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </Box>
  );
};

export default ReactFlowGraph;
