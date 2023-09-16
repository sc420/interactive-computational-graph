import { Alert, Grid, Snackbar, Toolbar } from "@mui/material";
import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
  type SyntheticEvent,
} from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type OnSelectionChangeParams,
  type XYPosition,
} from "reactflow";
import CoreGraphAdapter from "../adapters/CoreGraphAdapter";
import { TITLE_HEIGHT } from "../constants";
import Operation from "../core/Operation";
import Port from "../core/Port";
import type AddNodeData from "../features/AddNodeData";
import {
  ADD_DFDX_CODE,
  ADD_F_CODE,
  MULTIPLY_DFDX_CODE,
  MULTIPLY_F_CODE,
  PRODUCT_DFDX_CODE,
  PRODUCT_F_CODE,
  SQUARED_ERROR_DFDX_CODE,
  SQUARED_ERROR_F_CODE,
  SUM_DFDX_CODE,
  SUM_F_CODE,
  TEMPLATE_DFDX_CODE,
  TEMPLATE_F_CODE,
} from "../features/BuiltInCode";
import type ExplainDerivativeData from "../features/ExplainDerivativeData";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import {
  addReactFlowNode,
  deselectAllNodes,
  getLastSelectedNodeId,
  getNewReactFlowNodePosition,
  hideInputField,
  selectReactFlowNode,
  showInputFields,
  updateEdgeAnimations,
  updateReactFlowNodeDarkMode,
  updateReactFlowNodeDerivatives,
  updateReactFlowNodeFValues,
  updateReactFlowNodeHighlighted,
  updateReactFlowNodeInputValue,
} from "../features/ReactFlowController";
import type SelectedFeature from "../features/SelectedFeature";
import ReactFlowGraph from "../reactflow/ReactFlowGraph";
import ReactFlowGraphMock from "../reactflow/ReactFlowGraphMock";
import FeaturePanel from "./FeaturePanel";
import GraphToolbar from "./GraphToolbar";
import Title from "./Title";

const isTest = process.env.NODE_ENV === "test";

interface GraphContainerProps {
  // Sidebar
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  // Feature
  selectedFeature: SelectedFeature | null;
  // Theme
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const GraphContainer: FunctionComponent<GraphContainerProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  selectedFeature,
  isDarkMode,
  onToggleDarkMode,
}) => {
  // Core graph
  const [coreGraphAdapter] = useState<CoreGraphAdapter>(new CoreGraphAdapter());

  // Graph states
  const [isReverseMode, setReverseMode] = useState<boolean>(true);
  const [derivativeTarget, setDerivativeTarget] = useState<string | null>(null);
  const [featureOperations, setFeatureOperations] = useState<
    FeatureOperation[]
  >([
    {
      id: "add",
      text: "Add",
      type: "SIMPLE",
      operation: new Operation(ADD_F_CODE, ADD_DFDX_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Add two numbers $ a + b $",
    },
    {
      id: "multiply",
      text: "Multiply",
      type: "SIMPLE",
      operation: new Operation(MULTIPLY_F_CODE, MULTIPLY_DFDX_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Multiply two numbers $ a * b $",
    },
    {
      id: "sum",
      text: "Sum",
      type: "SIMPLE",
      operation: new Operation(SUM_F_CODE, SUM_DFDX_CODE),
      inputPorts: [new Port("x_i", true)],
      helpText: "Add all inputs $ \\sum_i x_{i} $",
    },
    {
      id: "product",
      text: "Product",
      type: "SIMPLE",
      operation: new Operation(PRODUCT_F_CODE, PRODUCT_DFDX_CODE),
      inputPorts: [new Port("x_i", true)],
      helpText: "Multiply all inputs $ \\prod_i x_{i} $",
    },
    {
      id: "squared_error",
      text: "Squared Error",
      type: "SIMPLE",
      operation: new Operation(SQUARED_ERROR_F_CODE, SQUARED_ERROR_DFDX_CODE),
      inputPorts: [new Port("y_true", false), new Port("y_estimate", false)],
      helpText: "Calculates squared error $ (y_t - y_e)^2 $",
    },
  ]);
  const [nextNodeId, setNextNodeId] = useState<number>(1);
  const [nextOperationId, setNextOperationId] = useState<number>(1);

  // Feature panel states
  const [explainDerivativeData, setExplainDerivativeData] = useState<
    ExplainDerivativeData[]
  >([]);

  // React Flow states
  const [reactFlowNodes, setReactFlowNodes] = useState<Node[]>([]);
  const [reactFlowEdges, setReactFlowEdges] = useState<Edge[]>([]);
  const [lastSelectedNodeId, setLastSelectedNodeId] = useState<string | null>(
    null,
  );

  // Error messages
  const [isSnackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const updateNodeDarkMode = useCallback(() => {
    setReactFlowNodes((nodes) =>
      updateReactFlowNodeDarkMode(isDarkMode, nodes),
    );
  }, [isDarkMode]);

  const handleInputChange = useCallback(
    (nodeId: string, inputPortId: string, value: string): void => {
      coreGraphAdapter.updateNodeValueById(nodeId, inputPortId, value);

      setReactFlowNodes((nodes) =>
        updateReactFlowNodeInputValue(nodeId, inputPortId, value, nodes),
      );
    },
    [coreGraphAdapter],
  );

  const handleBodyClick = useCallback((nodeId: string): void => {
    setReactFlowNodes((nodes) => selectReactFlowNode(nodeId, nodes));
  }, []);

  const handleAddNode = useCallback(
    (featureNodeType: FeatureNodeType) => {
      const nodeId = `${nextNodeId}`;

      coreGraphAdapter.addNode(featureNodeType, nodeId, featureOperations);

      const addNodeData: AddNodeData = {
        featureNodeType,
        nodeId,
        featureOperations,
        isReverseMode,
        derivativeTarget,
        onInputChange: handleInputChange,
        onBodyClick: handleBodyClick,
        isDarkMode,
      };
      setReactFlowNodes((nodes) => {
        nodes = deselectAllNodes(nodes);
        const position = getNewReactFlowNodePosition(nodes, lastSelectedNodeId);
        return addReactFlowNode(addNodeData, position, nodes);
      });

      setNextNodeId((nextNodeId) => nextNodeId + 1);
    },
    [
      coreGraphAdapter,
      derivativeTarget,
      featureOperations,
      handleBodyClick,
      handleInputChange,
      isDarkMode,
      isReverseMode,
      lastSelectedNodeId,
      nextNodeId,
    ],
  );

  const handleAddOperation = useCallback(() => {
    const id = `${nextOperationId}`;

    const newFeatureOperation: FeatureOperation = {
      id,
      text: `Operation ${nextOperationId}`,
      type: "CUSTOM",
      operation: new Operation(TEMPLATE_F_CODE, TEMPLATE_DFDX_CODE),
      inputPorts: [],
      helpText: "Write some Markdown and LaTeX here",
    };

    setFeatureOperations((featureOperations) =>
      featureOperations.concat(newFeatureOperation),
    );
    setNextOperationId((nextOperationId) => nextOperationId + 1);
  }, [nextOperationId]);

  const handleClearSelection = useCallback(() => {
    setReactFlowNodes((nodes) => deselectAllNodes(nodes));
  }, []);

  const handleSelectNode = useCallback((nodeId: string) => {
    setReactFlowNodes((nodes) => {
      const deselectedNodes = deselectAllNodes(nodes);
      return selectReactFlowNode(nodeId, deselectedNodes);
    });
  }, []);

  const handleReverseModeChange = useCallback(
    (isReverseMode: boolean) => {
      coreGraphAdapter.setDifferentiationMode(
        isReverseMode ? "REVERSE" : "FORWARD",
      );

      setReverseMode(() => isReverseMode);
    },
    [coreGraphAdapter],
  );

  const handleDerivativeTargetChange = useCallback(
    (nodeId: string | null) => {
      coreGraphAdapter.setTargetNode(nodeId);

      setDerivativeTarget(() => nodeId);
    },
    [coreGraphAdapter],
  );

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      coreGraphAdapter.changeNodes(changes);

      setReactFlowNodes((nodes) => applyNodeChanges(changes, nodes));
    },
    [coreGraphAdapter],
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      coreGraphAdapter.changeEdges(changes, reactFlowEdges);

      setReactFlowEdges((edges) => applyEdgeChanges(changes, edges));
    },
    [coreGraphAdapter, reactFlowEdges],
  );

  const handleSelectionChange = useCallback(
    (params: OnSelectionChangeParams): void => {
      setLastSelectedNodeId(getLastSelectedNodeId(params.nodes));

      const selectedNodeIds = params.nodes.map((node) => node.id);

      coreGraphAdapter.updateSelectedNodes(selectedNodeIds);

      setReactFlowNodes((nodes) =>
        updateReactFlowNodeHighlighted(
          selectedFeature,
          derivativeTarget,
          nodes,
        ),
      );

      setReactFlowEdges((edges) =>
        updateEdgeAnimations(
          selectedFeature,
          isReverseMode,
          derivativeTarget !== null,
          selectedNodeIds,
          edges,
        ),
      );
    },
    [coreGraphAdapter, derivativeTarget, isReverseMode, selectedFeature],
  );

  const handleConnect: OnConnect = useCallback(
    (connection: Connection) => {
      coreGraphAdapter.addConnection(connection);
    },
    [coreGraphAdapter],
  );

  const handleDropNode = useCallback(
    (featureNodeType: FeatureNodeType, position: XYPosition) => {
      const nodeId = `${nextNodeId}`;

      coreGraphAdapter.addNode(featureNodeType, nodeId, featureOperations);

      const addNodeData: AddNodeData = {
        featureNodeType,
        nodeId,
        featureOperations,
        isReverseMode,
        derivativeTarget,
        onInputChange: handleInputChange,
        onBodyClick: handleBodyClick,
        isDarkMode,
      };
      setReactFlowNodes((nodes) => {
        nodes = deselectAllNodes(nodes);
        return addReactFlowNode(addNodeData, position, nodes);
      });

      setNextNodeId((nextNodeId) => nextNodeId + 1);
    },
    [
      coreGraphAdapter,
      derivativeTarget,
      featureOperations,
      handleBodyClick,
      handleInputChange,
      isDarkMode,
      isReverseMode,
      nextNodeId,
    ],
  );

  const handleSnackbarClose = useCallback(
    (event?: SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      setSnackbarOpen(false);
    },
    [],
  );

  // Listen to core graph adapter events
  useEffect(() => {
    coreGraphAdapter.onConnectionAdded(handleConnectionAdded);
    coreGraphAdapter.onConnectionError(handleConnectionError);
    coreGraphAdapter.onTargetNodeUpdated(handleTargetNodeUpdated);
    coreGraphAdapter.onShowInputFields(handleShowInputFields);
    coreGraphAdapter.onHideInputField(handleHideInputField);
    coreGraphAdapter.onFValuesUpdated(handleFValuesUpdated);
    coreGraphAdapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    coreGraphAdapter.onExplainDerivativeDataUpdated(
      handleExplainDerivativeDataUpdated,
    );

    return () => {
      coreGraphAdapter.removeAllCallbacks();
    };
  });

  const handleConnectionAdded = useCallback((connection: Connection) => {
    setReactFlowEdges((edges) => addEdge(connection, edges));
  }, []);

  const handleConnectionError = useCallback((error: Error) => {
    setErrorMessage(error.message);
    setSnackbarOpen(true);
  }, []);

  const handleTargetNodeUpdated = useCallback((targetNodeId: string | null) => {
    setDerivativeTarget(() => targetNodeId);
  }, []);

  const handleShowInputFields = useCallback((emptyPortEdges: Edge[]) => {
    setReactFlowNodes((nodes) => showInputFields(emptyPortEdges, nodes));
  }, []);

  const handleHideInputField = useCallback(
    (nonEmptyPortConnection: Connection) => {
      setReactFlowNodes((nodes) =>
        hideInputField(nonEmptyPortConnection, nodes),
      );
    },
    [],
  );

  const handleFValuesUpdated = useCallback(
    (nodeIdToFValues: Map<string, string>) => {
      setReactFlowNodes((nodes) =>
        updateReactFlowNodeFValues(nodeIdToFValues, nodes),
      );
    },
    [],
  );

  const handleDerivativeValuesUpdated = useCallback(
    (nodeIdToDerivatives: Map<string, string>) => {
      setReactFlowNodes((nodes) =>
        updateReactFlowNodeDerivatives(
          nodeIdToDerivatives,
          isReverseMode,
          derivativeTarget,
          nodes,
        ),
      );
    },
    [derivativeTarget, isReverseMode],
  );

  const handleExplainDerivativeDataUpdated = useCallback(
    (data: ExplainDerivativeData[]): void => {
      setExplainDerivativeData(() => data);
    },
    [],
  );

  // Update node data whenever dark mode changes
  useEffect(() => {
    updateNodeDarkMode();
  }, [isDarkMode, updateNodeDarkMode]);

  return (
    <>
      {/* Toolbar padding */}
      <Toolbar />

      {/* Title */}
      <Title
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={onToggleSidebar}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
      >
        <GraphToolbar
          isReverseMode={isReverseMode}
          derivativeTarget={derivativeTarget}
          nodeIds={coreGraphAdapter.getNodeIds()}
          onReverseModeChange={handleReverseModeChange}
          onDerivativeTargetChange={handleDerivativeTargetChange}
        />
      </Title>

      {/* Graph content */}
      <Grid
        container
        direction="row"
        wrap="nowrap"
        sx={{ height: `calc(100vh - ${TITLE_HEIGHT}px)` }}
      >
        {/* Feature panel */}
        {selectedFeature !== null && (
          <Grid item borderRight={1} borderColor="divider">
            <FeaturePanel
              feature={selectedFeature}
              featureOperations={featureOperations}
              hasNodes={reactFlowNodes.length > 0}
              hasDerivativeTarget={derivativeTarget !== null}
              explainDerivativeData={explainDerivativeData}
              onAddNode={handleAddNode}
              onAddOperation={handleAddOperation}
              onClearSelection={handleClearSelection}
              onSelectNode={handleSelectNode}
            />
          </Grid>
        )}

        <Grid item display="flex" flexGrow={1}>
          <Grid container direction="column" flexGrow={1}>
            {/* Graph mock */}
            {isTest && (
              <ReactFlowGraphMock
                nodes={reactFlowNodes}
                edges={reactFlowEdges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onSelectionChange={handleSelectionChange}
                onConnect={handleConnect}
                onDropNode={handleDropNode}
              />
            )}

            {/* Graph */}
            <Grid item display="flex" flexGrow={1}>
              <ReactFlowGraph
                nodes={reactFlowNodes}
                edges={reactFlowEdges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onSelectionChange={handleSelectionChange}
                onConnect={handleConnect}
                onDropNode={handleDropNode}
                isDarkMode={isDarkMode}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Error message */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GraphContainer;
