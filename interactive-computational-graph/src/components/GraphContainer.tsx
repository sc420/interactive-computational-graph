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
import { TITLE_HEIGHT } from "../constants";
import {
  CycleError,
  InputNodeAlreadyConnectedError,
  InputPortFullError,
} from "../core/CoreErrors";
import Graph from "../core/Graph";
import Operation from "../core/Operation";
import Port from "../core/Port";
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
import {
  addCoreNodes,
  connectCoreEdge,
  connectDummyInputNode,
  disconnectCoreEdge,
  disconnectDummyInputNode,
  getNodeIds,
  isDummyInputNodeConnected,
  isNodeInputPortEmpty,
  removeCoreNodes,
  setCoreDerivativeTargetNode,
  setDifferentiationMode,
  updateCoreDerivativeTargetNode,
  updateNodeDerivativeValues,
  updateNodeFValues,
  updateNodeValueById,
  validateConnectCoreEdge,
} from "../features/CoreGraphController";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import {
  addReactFlowNode,
  deselectLastSelectedNode,
  findRemovedEdges,
  getNewReactFlowNodePosition,
  hideInputField,
  selectReactFlowNode,
  showInputFields,
  updateLastSelectedNodeId,
  updateReactFlowNodeDerivatives,
  updateReactFlowNodeFValues,
  updateReactFlowNodeInputValue,
} from "../features/ReactFlowController";
import type SelectedFeature from "../features/SelectedFeature";
import ReactFlowGraph from "../reactflow/ReactFlowGraph";
import ReactFlowGraphMock from "../reactflow/ReactFlowGraphMock";
import FeaturePanel from "./FeaturePanel";
import GraphToolbar from "./GraphToolbar";

const isTest = process.env.NODE_ENV === "test";

interface GraphContainerProps {
  selectedFeature: SelectedFeature | null;
}

const GraphContainer: FunctionComponent<GraphContainerProps> = ({
  selectedFeature,
}) => {
  // Core graph
  const [coreGraph, setCoreGraph] = useState<Graph | null>(null);

  // Feature states
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

  // React Flow states
  const [reactFlowNodes, setReactFlowNodes] = useState<Node[]>([]);
  const [reactFlowEdges, setReactFlowEdges] = useState<Edge[]>([]);
  const [lastSelectedNodeId, setLastSelectedNodeId] = useState<string | null>(
    null,
  );

  // Error messages
  const [isSnackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const findEmptyPortEdges = useCallback(
    (removedEdges: Edge[]): Edge[] => {
      if (coreGraph === null) {
        return [];
      }

      return removedEdges.filter(
        (removedEdge) =>
          typeof removedEdge.targetHandle === "string" &&
          isNodeInputPortEmpty(
            coreGraph,
            removedEdge.target,
            removedEdge.targetHandle,
          ),
      );
    },
    [coreGraph],
  );

  const showErrorMessage = useCallback((message: string) => {
    setErrorMessage(message);
    setSnackbarOpen(true);
  }, []);

  const tryConnectCoreEdges = useCallback(
    (connection: Connection): boolean => {
      if (coreGraph === null) {
        return false;
      }

      if (
        connection.source === null ||
        connection.target === null ||
        connection.targetHandle === null
      ) {
        return false;
      }

      let hasDisconnectedDummyInputNode = false;
      if (
        isDummyInputNodeConnected(
          coreGraph,
          connection.target,
          connection.targetHandle,
        )
      ) {
        disconnectDummyInputNode(
          coreGraph,
          connection.target,
          connection.targetHandle,
        );
        hasDisconnectedDummyInputNode = true;
      }

      try {
        validateConnectCoreEdge(
          coreGraph,
          connection.source,
          connection.target,
          connection.targetHandle,
        );
      } catch (error) {
        if (
          error instanceof InputNodeAlreadyConnectedError ||
          error instanceof InputPortFullError ||
          error instanceof CycleError
        ) {
          showErrorMessage(error.message);

          // Revert dummy input node disconnection
          if (hasDisconnectedDummyInputNode) {
            connectDummyInputNode(
              coreGraph,
              connection.target,
              connection.targetHandle,
            );
          }

          return false;
        } else {
          throw error;
        }
      }

      connectCoreEdge(
        coreGraph,
        connection.source,
        connection.target,
        connection.targetHandle,
      );

      return true;
    },
    [coreGraph, showErrorMessage],
  );

  const updateNodeValuesAndDerivatives = useCallback(() => {
    if (coreGraph === null) {
      return;
    }

    const updatedNodeIdToValues = updateNodeFValues(coreGraph);
    const updatedNodeIdToDerivatives = updateNodeDerivativeValues(coreGraph);

    setReactFlowNodes((nodes) =>
      updateReactFlowNodeFValues(updatedNodeIdToValues, nodes),
    );

    setReactFlowNodes((nodes) =>
      updateReactFlowNodeDerivatives(
        updatedNodeIdToDerivatives,
        isReverseMode,
        derivativeTarget,
        nodes,
      ),
    );
  }, [coreGraph, derivativeTarget, isReverseMode]);

  const handleInputChange = useCallback(
    (nodeId: string, inputPortId: string, value: string): void => {
      if (coreGraph === null) {
        return;
      }

      updateNodeValueById(coreGraph, nodeId, inputPortId, value);

      setReactFlowNodes((nodes) =>
        updateReactFlowNodeInputValue(nodeId, inputPortId, value, nodes),
      );

      updateNodeValuesAndDerivatives();
    },
    [coreGraph, updateNodeValuesAndDerivatives],
  );

  const handleBodyClick = useCallback((nodeId: string): void => {
    setReactFlowNodes((nodes) => selectReactFlowNode(nodeId, nodes));
  }, []);

  const handleAddNode = useCallback(
    (featureNodeType: FeatureNodeType) => {
      if (coreGraph === null) {
        return;
      }

      const id = `${nextNodeId}`;

      addCoreNodes(coreGraph, featureNodeType, id, featureOperations);

      setReactFlowNodes((nodes) => {
        const position = getNewReactFlowNodePosition(nodes, lastSelectedNodeId);
        nodes = deselectLastSelectedNode(nodes, lastSelectedNodeId);
        return addReactFlowNode(
          featureNodeType,
          id,
          featureOperations,
          isReverseMode,
          derivativeTarget,
          handleInputChange,
          handleBodyClick,
          position,
          nodes,
        );
      });

      setNextNodeId((nextNodeId) => nextNodeId + 1);
    },
    [
      coreGraph,
      derivativeTarget,
      featureOperations,
      handleBodyClick,
      handleInputChange,
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

  const handleReverseModeChange = useCallback(
    (isReverseMode: boolean) => {
      if (coreGraph === null) {
        return;
      }

      setReverseMode(() => isReverseMode);

      setDifferentiationMode(coreGraph, isReverseMode);
    },
    [coreGraph],
  );

  const handleDerivativeTargetChange = useCallback(
    (nodeId: string | null) => {
      if (coreGraph === null) {
        return;
      }

      setDerivativeTarget(() => nodeId);

      setCoreDerivativeTargetNode(coreGraph, nodeId);
    },
    [coreGraph],
  );

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      if (coreGraph === null) {
        return;
      }

      changes.forEach((change) => {
        switch (change.type) {
          case "remove": {
            removeCoreNodes(coreGraph, change.id);
            break;
          }
        }
      });

      const updatedTargetNode = updateCoreDerivativeTargetNode(
        coreGraph,
        derivativeTarget,
      );

      setDerivativeTarget(() => updatedTargetNode);

      setReactFlowNodes((nodes) => applyNodeChanges(changes, nodes));
    },
    [coreGraph, derivativeTarget],
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      if (coreGraph === null) {
        return;
      }

      const removedEdges = findRemovedEdges(changes, reactFlowEdges);

      removedEdges.forEach((removedEdge) => {
        if (typeof removedEdge.targetHandle !== "string") {
          return;
        }
        disconnectCoreEdge(
          coreGraph,
          removedEdge.source,
          removedEdge.target,
          removedEdge.targetHandle,
        );
      });

      const emptyPortEdges = findEmptyPortEdges(removedEdges);

      emptyPortEdges.forEach((emptyPortEdge) => {
        if (typeof emptyPortEdge.targetHandle !== "string") {
          return;
        }
        if (
          isDummyInputNodeConnected(
            coreGraph,
            emptyPortEdge.target,
            emptyPortEdge.targetHandle,
          )
        ) {
          return;
        }
        connectDummyInputNode(
          coreGraph,
          emptyPortEdge.target,
          emptyPortEdge.targetHandle,
        );
      });

      setReactFlowNodes((nodes) => showInputFields(emptyPortEdges, nodes));

      updateNodeValuesAndDerivatives();

      setReactFlowEdges((edges) => applyEdgeChanges(changes, edges));
    },
    [
      coreGraph,
      findEmptyPortEdges,
      reactFlowEdges,
      updateNodeValuesAndDerivatives,
    ],
  );

  const handleSelectionChange = useCallback(
    (params: OnSelectionChangeParams): void => {
      setLastSelectedNodeId(updateLastSelectedNodeId(params.nodes));
    },
    [],
  );

  const handleConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (coreGraph === null) {
        return;
      }

      if (
        connection.source === null ||
        connection.target === null ||
        connection.targetHandle === null
      ) {
        return;
      }

      if (!tryConnectCoreEdges(connection)) {
        return;
      }

      setReactFlowNodes((nodes) => hideInputField(connection, nodes));

      updateNodeValuesAndDerivatives();

      setReactFlowEdges((edges) => addEdge(connection, edges));
    },
    [coreGraph, tryConnectCoreEdges, updateNodeValuesAndDerivatives],
  );

  const handleDropNode = useCallback(
    (featureNodeType: FeatureNodeType, position: XYPosition) => {
      if (coreGraph === null) {
        return;
      }

      const id = `${nextNodeId}`;

      addCoreNodes(coreGraph, featureNodeType, id, featureOperations);

      setReactFlowNodes((nodes) => {
        nodes = deselectLastSelectedNode(nodes, lastSelectedNodeId);
        return addReactFlowNode(
          featureNodeType,
          id,
          featureOperations,
          isReverseMode,
          derivativeTarget,
          handleInputChange,
          handleBodyClick,
          position,
          nodes,
        );
      });

      setNextNodeId((nextNodeId) => nextNodeId + 1);
    },
    [
      coreGraph,
      derivativeTarget,
      featureOperations,
      handleBodyClick,
      handleInputChange,
      isReverseMode,
      lastSelectedNodeId,
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

  // Initialize the core graph
  useEffect(() => {
    const coreGraph = new Graph();
    setCoreGraph(coreGraph);
  }, []);

  // Update node values and derivatives whenever derivative target or reverse
  // mode changes
  useEffect(() => {
    updateNodeValuesAndDerivatives();
  }, [
    coreGraph,
    derivativeTarget,
    isReverseMode,
    updateNodeValuesAndDerivatives,
  ]);

  return (
    <>
      {/* Toolbar padding */}
      <Toolbar />

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
              onAddNode={handleAddNode}
              onAddOperation={handleAddOperation}
            />
          </Grid>
        )}

        <Grid item display="flex" flexGrow={1}>
          <Grid container direction="column" flexGrow={1}>
            {/* Graph toolbar */}
            <Grid item>
              <GraphToolbar
                isReverseMode={isReverseMode}
                derivativeTarget={derivativeTarget}
                nodeIds={coreGraph === null ? [] : getNodeIds(coreGraph)}
                onReverseModeChange={handleReverseModeChange}
                onDerivativeTargetChange={handleDerivativeTargetChange}
              />
            </Grid>
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
