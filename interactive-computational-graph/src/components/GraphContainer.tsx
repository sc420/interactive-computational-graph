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
  type OnInit,
  type OnNodesChange,
  type OnSelectionChangeParams,
  type ReactFlowInstance,
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
  BINARY_CROSS_ENTROPY_DFDX_CODE,
  BINARY_CROSS_ENTROPY_F_CODE,
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
  RELU_DFDX_CODE,
  RELU_F_CODE,
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
  TANH_DFDX_CODE,
  TANH_F_CODE,
  TAN_DFDX_CODE,
  TAN_F_CODE,
  TEMPLATE_DFDX_CODE,
  TEMPLATE_F_CODE,
} from "../features/BuiltInCode";
import CoreGraphAdapter from "../features/CoreGraphAdapter";
import type ExplainDerivativeData from "../features/ExplainDerivativeData";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import { findFeatureOperation } from "../features/FeatureOperationFinder";
import type NodeData from "../features/NodeData";
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
import type CoreOperationState from "../states/CoreOperationState";
import type FeatureOperationState from "../states/FeatureOperationState";
import type GraphContainerState from "../states/GraphContainerState";
import type PortState from "../states/PortState";
import FeaturePanel from "./FeaturePanel";
import GraphToolbar from "./GraphToolbar";
import Title from "./Title";
import WelcomeDialog from "./WelcomeDialog";

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
      type: "basic",
      namePrefix: "a",
      operation: new Operation(ADD_F_CODE, ADD_DFDX_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Add two numbers, i.e., a + b",
    },
    {
      id: "subtract",
      text: "Subtract",
      type: "basic",
      namePrefix: "s",
      operation: new Operation(SUBTRACT_F_CODE, SUBTRACT_DFDX_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Subtract two numbers, i.e., a - b",
    },
    {
      id: "multiply",
      text: "Multiply",
      type: "basic",
      namePrefix: "m",
      operation: new Operation(MULTIPLY_F_CODE, MULTIPLY_DFDX_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Multiply two numbers, i.e., a * b",
    },
    {
      id: "divide",
      text: "Divide",
      type: "basic",
      namePrefix: "d",
      operation: new Operation(DIVIDE_F_CODE, DIVIDE_DFDX_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Divide two numbers, i.e., a / b",
    },
    {
      id: "power",
      text: "Power",
      type: "basic",
      namePrefix: "p",
      operation: new Operation(POWER_F_CODE, POWER_DFDX_CODE),
      inputPorts: [new Port("x", false), new Port("n", false)],
      helpText: "Calculate the power, i.e., x^n",
    },
    {
      id: "exp",
      text: "Exp",
      type: "basic",
      namePrefix: "e",
      operation: new Operation(EXP_F_CODE, EXP_DFDX_CODE),
      inputPorts: [new Port("x", false)],
      helpText: "Calculate the exponential function, i.e., e^x",
    },
    {
      id: "ln",
      text: "Ln",
      type: "basic",
      namePrefix: "l",
      operation: new Operation(LN_F_CODE, LN_DFDX_CODE),
      inputPorts: [new Port("x", false)],
      helpText: "Calculate the log: ln(x)",
    },
    {
      id: "sum",
      text: "Sum",
      type: "aggregate",
      namePrefix: "s",
      operation: new Operation(SUM_F_CODE, SUM_DFDX_CODE),
      inputPorts: [new Port("x_i", true)],
      helpText: "Add all inputs: sum_i x_i, i.e., x_0 + x_1 + ...",
    },
    {
      id: "product",
      text: "Product",
      type: "aggregate",
      namePrefix: "p",
      operation: new Operation(PRODUCT_F_CODE, PRODUCT_DFDX_CODE),
      inputPorts: [new Port("x_i", true)],
      helpText: "Multiply all inputs: prod_i x_i, i.e., x_0 * x_1 * ...",
    },
    {
      id: "sin",
      text: "Sin",
      type: "trigonometric",
      namePrefix: "s",
      operation: new Operation(SIN_F_CODE, SIN_DFDX_CODE),
      inputPorts: [new Port("x", false)],
      helpText: "Calculate sin(x)",
    },
    {
      id: "cos",
      text: "Cos",
      type: "trigonometric",
      namePrefix: "c",
      operation: new Operation(COS_F_CODE, COS_DFDX_CODE),
      inputPorts: [new Port("x", false)],
      helpText: "Calculate cos(x)",
    },
    {
      id: "tan",
      text: "Tan",
      type: "trigonometric",
      namePrefix: "t",
      operation: new Operation(TAN_F_CODE, TAN_DFDX_CODE),
      inputPorts: [new Port("x", false)],
      helpText: "Calculate tan(x)",
    },
    {
      id: "linear",
      text: "Linear",
      type: "activation",
      namePrefix: "l",
      operation: new Operation(IDENTITY_F_CODE, IDENTITY_DFDX_CODE),
      inputPorts: [new Port("x", false)],
      helpText: "Linear activation function, i.e., y=x",
    },
    {
      id: "sigmoid",
      text: "Sigmoid",
      type: "activation",
      namePrefix: "s",
      operation: new Operation(SIGMOID_F_CODE, SIGMOID_DFDX_CODE),
      inputPorts: [new Port("x", false)],
      helpText: "Sigmoid activation function, i.e., y=1/(1 + e^(-x))",
    },
    {
      id: "tanh",
      text: "Tanh",
      type: "activation",
      namePrefix: "s",
      operation: new Operation(TANH_F_CODE, TANH_DFDX_CODE),
      inputPorts: [new Port("x", false)],
      helpText:
        "Tanh activation function, i.e., y=(e^x - e^(-x))(e^x + e^(-x))",
    },
    {
      id: "relu",
      text: "ReLU",
      type: "activation",
      namePrefix: "r",
      operation: new Operation(RELU_F_CODE, RELU_DFDX_CODE),
      inputPorts: [new Port("x", false)],
      helpText: "ReLU activation function, i.e., y=max(0, x)",
    },
    {
      id: "squared_error",
      text: "Squared Error",
      type: "loss",
      namePrefix: "s",
      operation: new Operation(SQUARED_ERROR_F_CODE, SQUARED_ERROR_DFDX_CODE),
      inputPorts: [new Port("y_t", false), new Port("y_e", false)],
      helpText: `Calculate the squared error, i.e., (y_t - y_e)^2
 (y_t: true value, y_e: estimated value)`,
    },
    {
      id: "binary_cross_entropy",
      text: "Binary Cross-Entropy",
      type: "loss",
      namePrefix: "b",
      operation: new Operation(
        BINARY_CROSS_ENTROPY_F_CODE,
        BINARY_CROSS_ENTROPY_DFDX_CODE,
      ),
      inputPorts: [new Port("y_t", false), new Port("y_e", false)],
      helpText: `Calculate the binary cross-entropy,
 i.e., y_t * log(y_e) + (1 - y_t) * log(1 - y_e)
 (y_t: true value, y_e: estimated value)`,
    },
  ]);
  const [nextNodeId, setNextNodeId] = useState<number>(0);
  const [nodeNameBuilder] = useState<NodeNameBuilder>(new NodeNameBuilder());
  const [nextOperationId, setNextOperationId] = useState<number>(0);

  // Feature panel states
  const [operationIdsAddedAtLeastOnce, setOperationIdsAddedAtLeastOnce] =
    useState(new Set<string>());
  const [explainDerivativeData, setExplainDerivativeData] = useState<
    ExplainDerivativeData[]
  >([]);

  // React Flow states
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
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

  const addNode = useCallback(
    (featureNodeType: FeatureNodeType, position: XYPosition | null) => {
      const featureOperation = findFeatureOperation(
        featureNodeType,
        featureOperations,
      );

      const nodeId = `${nextNodeId}`;
      const nodeName = nodeNameBuilder.buildName(
        featureNodeType,
        featureOperation,
      );

      // Add the core node
      coreGraphAdapter.addNode(
        featureNodeType,
        featureOperation,
        nodeId,
        nodeName,
      );

      // Add the ReactFlow node
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
        const finalPosition =
          position ?? getNewReactFlowNodePosition(nodes, lastSelectedNodeId);
        return addReactFlowNode(addNodeData, finalPosition, nodes);
      });

      // Add the operation ID to the set for operation nodes
      if (featureOperation !== null) {
        setOperationIdsAddedAtLeastOnce(
          (oldOperationIds) =>
            new Set([...oldOperationIds, featureOperation.id]),
        );
      }

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

  const handleAddNode = useCallback(
    (featureNodeType: FeatureNodeType) => {
      addNode(featureNodeType, null);
    },
    [addNode],
  );

  const handleAddOperation = useCallback(() => {
    const id = `${nextOperationId}`;

    const newFeatureOperation: FeatureOperation = {
      id,
      text: `Operation ${nextOperationId + 1}`,
      type: "custom",
      namePrefix: "f",
      operation: new Operation(TEMPLATE_F_CODE, TEMPLATE_DFDX_CODE),
      inputPorts: [],
      helpText: "What does this operation do",
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

          featureOperation.operation.setFCode(
            updatedOperation.operation.getFCode(),
          );
          featureOperation.operation.setDfdxCode(
            updatedOperation.operation.getDfdxCode(),
          );
          return {
            ...updatedOperation,
            operation: featureOperation.operation,
          };
        });
      });

      coreGraphAdapter.updateOutputs();
    },
    [coreGraphAdapter],
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

  const saveFeatureOperations = useCallback((): FeatureOperationState[] => {
    return featureOperations.map((featureOperation) => {
      const operationState: CoreOperationState = {
        fCode: featureOperation.operation.getFCode(),
        dfdxCode: featureOperation.operation.getDfdxCode(),
      };
      const inputPortStates: PortState[] = featureOperation.inputPorts.map(
        (inputPort) => {
          return {
            id: inputPort.getId(),
            allowMultiEdges: inputPort.isAllowMultiEdges(),
          };
        },
      );
      return {
        id: featureOperation.id,
        text: featureOperation.text,
        type: featureOperation.type,
        namePrefix: featureOperation.namePrefix,
        operation: operationState,
        inputPorts: inputPortStates,
        helpText: featureOperation.helpText,
      };
    });
  }, [featureOperations]);

  const handleSave = useCallback((): GraphContainerState => {
    if (reactFlowInstance === null) {
      throw new Error("React flow instance should not be null");
    }

    const coreGraphAdapterState = coreGraphAdapter.save();
    const nodeNameBuilderState = nodeNameBuilder.save();
    return {
      coreGraphAdapterState,
      isReverseMode,
      derivativeTarget,
      featureOperations: saveFeatureOperations(),
      nextNodeId,
      nodeNameBuilderState,
      nextOperationId,
      operationIdsAddedAtLeastOnce: Array.from(operationIdsAddedAtLeastOnce),
      reactFlowState: reactFlowInstance.toObject(),
    };
  }, [
    coreGraphAdapter,
    derivativeTarget,
    isReverseMode,
    nextNodeId,
    nextOperationId,
    nodeNameBuilder,
    operationIdsAddedAtLeastOnce,
    reactFlowInstance,
    saveFeatureOperations,
  ]);

  const loadFeatureOperations = useCallback(
    (featureOperationStates: FeatureOperationState[]): FeatureOperation[] => {
      return featureOperationStates.map((featureOperationState) => {
        return {
          id: featureOperationState.id,
          text: featureOperationState.text,
          type: featureOperationState.type,
          namePrefix: featureOperationState.namePrefix,
          operation: new Operation(
            featureOperationState.operation.fCode,
            featureOperationState.operation.dfdxCode,
          ),
          inputPorts: featureOperationState.inputPorts.map(
            (inputPortState) =>
              new Port(inputPortState.id, inputPortState.allowMultiEdges),
          ),
          helpText: featureOperationState.helpText,
        };
      });
    },
    [],
  );

  const loadReactFlowNode = useCallback(
    (nodes: Node[]) => {
      return nodes.map((node) => {
        const data = node.data as NodeData;
        // Set the new data to notify React Flow about the change
        const newData: NodeData = {
          ...data,
          // Set the callbacks because the json file doesn't have these
          onNameChange: handleNameChange,
          onInputChange: handleInputChange,
          onBodyClick: handleBodyClick,
          onDerivativeClick: handleDerivativeClick,
        };

        node.data = newData;
        return node;
      });
    },
    [
      handleBodyClick,
      handleDerivativeClick,
      handleInputChange,
      handleNameChange,
    ],
  );

  const loadReactFlow = useCallback(
    (reactFlowState: any) => {
      // Reference: https://reactflow.dev/examples/interaction/save-and-restore
      const { x = 0, y = 0, zoom = 1 } = reactFlowState.viewport;
      setReactFlowNodes(loadReactFlowNode(reactFlowState.nodes));
      setReactFlowEdges(reactFlowState.edges);
      reactFlowInstance?.setViewport({ x, y, zoom });
    },
    [loadReactFlowNode, reactFlowInstance],
  );

  const handleLoad = useCallback(
    (graphContainerState: GraphContainerState) => {
      const loadedFeatureOperations = loadFeatureOperations(
        graphContainerState.featureOperations,
      );

      coreGraphAdapter.load(
        graphContainerState.coreGraphAdapterState,
        loadedFeatureOperations,
      );
      setReverseMode(graphContainerState.isReverseMode);
      setDerivativeTarget(graphContainerState.derivativeTarget);
      setFeatureOperations(loadedFeatureOperations);
      setNextNodeId(graphContainerState.nextNodeId);
      nodeNameBuilder.load(graphContainerState.nodeNameBuilderState);
      setNextOperationId(graphContainerState.nextOperationId);
      setOperationIdsAddedAtLeastOnce(
        new Set(graphContainerState.operationIdsAddedAtLeastOnce),
      );
      loadReactFlow(graphContainerState.reactFlowState);
    },
    [coreGraphAdapter, loadFeatureOperations, loadReactFlow, nodeNameBuilder],
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

  const handleReactFlowInit: OnInit = useCallback((reactFlowInstance) => {
    setReactFlowInstance(reactFlowInstance);
  }, []);

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
      setLastSelectedNodeId(getLastSelectedNodeId(params));

      const selectedNodeIds = params.nodes.map((node) => node.id);

      coreGraphAdapter.updateSelectedNodeIds(selectedNodeIds);

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
      addNode(featureNodeType, position);
    },
    [addNode],
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

  return (
    <>
      {/* Welcome dialog */}
      {!isTest && <WelcomeDialog onLoad={handleLoad} />}

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
              operationIdsAddedAtLeastOnce={operationIdsAddedAtLeastOnce}
              isDarkMode={isDarkMode}
              hasNodes={reactFlowNodes.length > 0}
              hasDerivativeTarget={derivativeTarget !== null}
              explainDerivativeData={explainDerivativeData}
              onAddNode={handleAddNode}
              onAddOperation={handleAddOperation}
              onEditOperation={handleEditOperation}
              onDeleteOperation={handleDeleteOperation}
              onClearSelection={handleClearSelection}
              onSelectNode={handleSelectNode}
              onSave={handleSave}
              onLoad={handleLoad}
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
                onInit={handleReactFlowInit}
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
