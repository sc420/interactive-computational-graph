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
import type DifferentiationMode from "../core/DifferentiationMode";
import Operation from "../core/Operation";
import Port from "../core/Port";
import type AddNodeData from "../features/AddNodeData";
import {
  ADD_DFDX_CODE,
  ADD_F_CODE,
  COS_DFDX_CODE,
  COS_F_CODE,
  DIVIDE_DFDX_CODE,
  DIVIDE_F_CODE,
  EXP_DFDX_CODE,
  EXP_F_CODE,
  IDENTITY_DFDX_CODE,
  IDENTITY_F_CODE,
  LN_DFDX_CODE,
  LN_F_CODE,
  MULTIPLY_DFDX_CODE,
  MULTIPLY_F_CODE,
  POWER_DFDX_CODE,
  POWER_F_CODE,
  PRODUCT_DFDX_CODE,
  PRODUCT_F_CODE,
  SIGMOID_DFDX_CODE,
  SIGMOID_F_CODE,
  SIN_DFDX_CODE,
  SIN_F_CODE,
  SQUARED_ERROR_DFDX_CODE,
  SQUARED_ERROR_F_CODE,
  SUBTRACT_DFDX_CODE,
  SUBTRACT_F_CODE,
  SUM_DFDX_CODE,
  SUM_F_CODE,
  TAN_DFDX_CODE,
  TAN_F_CODE,
  TEMPLATE_DFDX_CODE,
  TEMPLATE_F_CODE,
} from "../features/BuiltInCode";
import CoreGraphAdapter from "../features/CoreGraphAdapter";
import type ExplainDerivativeData from "../features/ExplainDerivativeData";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import NodeNameBuilder from "../features/NodeNameBuilder";
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
  updateReactFlowNodeName,
} from "../features/ReactFlowController";
import type SelectedFeature from "../features/SelectedFeature";
import ReactFlowGraph from "../reactflow/ReactFlowGraph";
import ReactFlowGraphTestHelper from "../reactflow/ReactFlowGraphTestHelper";
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
  onSelectFeature: (feature: SelectedFeature | null) => void;
  // Theme
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const GraphContainer: FunctionComponent<GraphContainerProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  selectedFeature,
  onSelectFeature,
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
      namePrefix: "a",
      operation: new Operation(ADD_F_CODE, ADD_DFDX_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Add two numbers $ a + b $",
    },
    {
      id: "subtract",
      text: "Subtract",
      type: "SIMPLE",
      namePrefix: "s",
      operation: new Operation(SUBTRACT_F_CODE, SUBTRACT_DFDX_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Subtract two numbers $ a - b $",
    },
    {
      id: "multiply",
      text: "Multiply",
      type: "SIMPLE",
      namePrefix: "m",
      operation: new Operation(MULTIPLY_F_CODE, MULTIPLY_DFDX_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Multiply two numbers $ a * b $",
    },
    {
      id: "divide",
      text: "Divide",
      type: "SIMPLE",
      namePrefix: "d",
      operation: new Operation(DIVIDE_F_CODE, DIVIDE_DFDX_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Divide two numbers $ a / b $",
    },
    {
      id: "power",
      text: "Power",
      type: "SIMPLE",
      namePrefix: "p",
      operation: new Operation(POWER_F_CODE, POWER_DFDX_CODE),
      inputPorts: [new Port("x", false), new Port("n", false)],
      helpText: "Calculate the power $ x ^ n $",
    },
    {
      id: "exp",
      text: "Exp",
      type: "SIMPLE",
      namePrefix: "e",
      operation: new Operation(EXP_F_CODE, EXP_DFDX_CODE),
      inputPorts: [new Port("x", false)],
      helpText: "Calculate the exp $ e ^ x $",
    },
    {
      id: "ln",
      text: "Ln",
      type: "SIMPLE",
      namePrefix: "l",
      operation: new Operation(LN_F_CODE, LN_DFDX_CODE),
      inputPorts: [new Port("x", false)],
      helpText: "Calculate the log $ \\ln(x) $",
    },
    {
      id: "sum",
      text: "Sum",
      type: "SIMPLE",
      namePrefix: "s",
      operation: new Operation(SUM_F_CODE, SUM_DFDX_CODE),
      inputPorts: [new Port("x_i", true)],
      helpText: "Add all inputs $ \\sum_i x_{i} $",
    },
    {
      id: "product",
      text: "Product",
      type: "SIMPLE",
      namePrefix: "p",
      operation: new Operation(PRODUCT_F_CODE, PRODUCT_DFDX_CODE),
      inputPorts: [new Port("x_i", true)],
      helpText: "Multiply all inputs $ \\prod_i x_{i} $",
    },
    {
      id: "sin",
      text: "Sin",
      type: "SIMPLE",
      namePrefix: "s",
      operation: new Operation(SIN_F_CODE, SIN_DFDX_CODE),
      inputPorts: [new Port("x", true)],
      helpText: "Calculate $ \\sin(x) $",
    },
    {
      id: "cos",
      text: "Cos",
      type: "SIMPLE",
      namePrefix: "c",
      operation: new Operation(COS_F_CODE, COS_DFDX_CODE),
      inputPorts: [new Port("x", true)],
      helpText: "Calculate $ \\cos(x) $",
    },
    {
      id: "tan",
      text: "Tan",
      type: "SIMPLE",
      namePrefix: "t",
      operation: new Operation(TAN_F_CODE, TAN_DFDX_CODE),
      inputPorts: [new Port("x", true)],
      helpText: "Calculate $ \\tan(x) $",
    },
    {
      id: "linear",
      text: "Linear",
      type: "SIMPLE",
      namePrefix: "l",
      operation: new Operation(IDENTITY_F_CODE, IDENTITY_DFDX_CODE),
      inputPorts: [new Port("x", true)],
      helpText: "Linear activation function $ x $",
    },
    {
      id: "sigmoid",
      text: "Sigmoid",
      type: "SIMPLE",
      namePrefix: "s",
      operation: new Operation(SIGMOID_F_CODE, SIGMOID_DFDX_CODE),
      inputPorts: [new Port("x", true)],
      helpText: "Sigmoid activation function $ \\frac{1}{1 + e^{-x}} $",
    },
    {
      id: "squared_error",
      text: "Squared Error",
      type: "SIMPLE",
      namePrefix: "s",
      operation: new Operation(SQUARED_ERROR_F_CODE, SQUARED_ERROR_DFDX_CODE),
      inputPorts: [new Port("y_t", false), new Port("y_e", false)],
      helpText: "Calculate squared error $ (y_t - y_e)^2 $",
    },
  ]);
  const [nextNodeId, setNextNodeId] = useState<number>(0);
  const [nodeNameBuilder] = useState<NodeNameBuilder>(new NodeNameBuilder());
  const [nextOperationId, setNextOperationId] = useState<number>(0);

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

  const handleNameChange = useCallback(
    (nodeId: string, name: string): void => {
      coreGraphAdapter.updateNodeNameById(nodeId, name);
    },
    [coreGraphAdapter],
  );

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

  const handleDerivativeClick = useCallback(
    (nodeId: string): void => {
      onSelectFeature("explain-derivatives");

      setReactFlowNodes((nodes) => selectReactFlowNode(nodeId, nodes));
    },
    [onSelectFeature],
  );

  const handleAddNode = useCallback(
    (featureNodeType: FeatureNodeType) => {
      const featureOperation = findFeatureOperation(
        featureNodeType,
        featureOperations,
      );

      const nodeId = `${nextNodeId}`;
      const nodeName = nodeNameBuilder.buildName(
        featureNodeType,
        featureOperation,
      );

      coreGraphAdapter.addNode(
        featureNodeType,
        featureOperation,
        nodeId,
        nodeName,
      );

      const initialOutputValue = coreGraphAdapter.getNodeValueById(nodeId);
      const derivativeTargetName =
        derivativeTarget === null
          ? null
          : coreGraphAdapter.getNodeNameById(derivativeTarget);
      const addNodeData: AddNodeData = {
        featureNodeType,
        featureOperation,
        nodeId,
        nodeName,
        initialOutputValue,
        isReverseMode,
        derivativeTargetName,
        onNameChange: handleNameChange,
        onInputChange: handleInputChange,
        onBodyClick: handleBodyClick,
        onDerivativeClick: handleDerivativeClick,
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
      handleDerivativeClick,
      handleInputChange,
      handleNameChange,
      isDarkMode,
      isReverseMode,
      lastSelectedNodeId,
      nextNodeId,
      nodeNameBuilder,
    ],
  );

  const handleAddOperation = useCallback(() => {
    const id = `${nextOperationId}`;

    const newFeatureOperation: FeatureOperation = {
      id,
      text: `Operation ${nextOperationId}`,
      type: "CUSTOM",
      namePrefix: "f",
      operation: new Operation(TEMPLATE_F_CODE, TEMPLATE_DFDX_CODE),
      inputPorts: [],
      helpText: "Write some Markdown and LaTeX here",
    };

    setFeatureOperations((featureOperations) =>
      featureOperations.concat(newFeatureOperation),
    );
    setNextOperationId((nextOperationId) => nextOperationId + 1);
  }, [nextOperationId]);

  const handleEditOperation = useCallback(
    (updatedOperation: FeatureOperation) => {
      setFeatureOperations((featureOperations) => {
        return featureOperations.map((featureOperation) => {
          if (featureOperation.id !== updatedOperation.id) {
            return featureOperation;
          }
          return updatedOperation;
        });
      });
    },
    [],
  );

  const handleDeleteOperation = useCallback((operationId: string) => {
    setFeatureOperations((featureOperations) => {
      return featureOperations.filter((featureOperation) => {
        return featureOperation.id !== operationId;
      });
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setReactFlowNodes((nodes) => deselectAllNodes(nodes));
  }, []);

  const handleSelectNode = useCallback(
    (nodeId: string) => {
      const visibleNodeId = coreGraphAdapter.getVisibleNodeIdById(nodeId);

      setReactFlowNodes((nodes) => {
        const deselectedNodes = deselectAllNodes(nodes);
        return selectReactFlowNode(visibleNodeId, deselectedNodes);
      });
    },
    [coreGraphAdapter],
  );

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
      const featureOperation = findFeatureOperation(
        featureNodeType,
        featureOperations,
      );

      const nodeId = `${nextNodeId}`;
      const nodeName = nodeNameBuilder.buildName(
        featureNodeType,
        featureOperation,
      );

      coreGraphAdapter.addNode(
        featureNodeType,
        featureOperation,
        nodeId,
        nodeName,
      );

      const initialOutputValue = coreGraphAdapter.getNodeValueById(nodeId);
      const derivativeTargetName =
        derivativeTarget === null
          ? null
          : coreGraphAdapter.getNodeNameById(derivativeTarget);
      const addNodeData: AddNodeData = {
        featureNodeType,
        featureOperation,
        nodeId,
        nodeName,
        initialOutputValue,
        isReverseMode,
        derivativeTargetName,
        onNameChange: handleNameChange,
        onInputChange: handleInputChange,
        onBodyClick: handleBodyClick,
        onDerivativeClick: handleDerivativeClick,
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
      handleDerivativeClick,
      handleInputChange,
      handleNameChange,
      isDarkMode,
      isReverseMode,
      nextNodeId,
      nodeNameBuilder,
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
    coreGraphAdapter.onNodeNameUpdated(handleNodeNameUpdated);
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

  const handleNodeNameUpdated = useCallback((nodeId: string, name: string) => {
    setReactFlowNodes((nodes) => updateReactFlowNodeName(nodeId, name, nodes));
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
    (
      differentiationMode: DifferentiationMode,
      targetNodeName: string | null,
      nodeIdToDerivatives: ReadonlyMap<string, string>,
      nodeIdToNames: ReadonlyMap<string, string>,
    ) => {
      setReactFlowNodes((nodes) =>
        updateReactFlowNodeDerivatives(
          nodeIdToDerivatives,
          nodeIdToNames,
          differentiationMode === "REVERSE",
          targetNodeName,
          nodes,
        ),
      );
    },
    [],
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

  const findFeatureOperation = (
    featureNodeType: FeatureNodeType,
    featureOperations: FeatureOperation[],
  ): FeatureOperation | null => {
    if (featureNodeType.nodeType !== "OPERATION") {
      return null;
    }

    const operationId = featureNodeType.operationId;
    const operation = featureOperations.find((op) => op.id === operationId);
    if (operation === undefined) {
      throw new Error(`Couldn't find the feature operation ${operationId}`);
    }
    return operation;
  };

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
          nodeIds={coreGraphAdapter.getVisibleNodeIds()}
          nodeNames={coreGraphAdapter.getVisibleNodeNames()}
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
              isDarkMode={isDarkMode}
              onAddNode={handleAddNode}
              onAddOperation={handleAddOperation}
              onEditOperation={handleEditOperation}
              onDeleteOperation={handleDeleteOperation}
              onClearSelection={handleClearSelection}
              onSelectNode={handleSelectNode}
            />
          </Grid>
        )}

        <Grid item display="flex" flexGrow={1}>
          <Grid container direction="column" flexGrow={1}>
            {/* Graph mock */}
            {isTest && (
              <Grid item display="flex">
                <ReactFlowGraphTestHelper
                  nodes={reactFlowNodes}
                  edges={reactFlowEdges}
                  onNodesChange={handleNodesChange}
                  onEdgesChange={handleEdgesChange}
                  onSelectionChange={handleSelectionChange}
                  onConnect={handleConnect}
                  onDropNode={handleDropNode}
                />
              </Grid>
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
