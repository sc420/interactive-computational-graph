import { Grid, Toolbar } from "@mui/material";
import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
} from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type OnSelectionChangeParams,
  type XYPosition,
} from "reactflow";
import { TITLE_HEIGHT } from "../constants";
import Graph from "../core/Graph";
import Operation from "../core/Operation";
import Port from "../core/Port";
import {
  ADD_DFDY_CODE,
  ADD_F_CODE,
  PRODUCT_DFDY_CODE,
  PRODUCT_F_CODE,
  SQUARED_ERROR_DFDY_CODE,
  SQUARED_ERROR_F_CODE,
  SUM_DFDY_CODE,
  SUM_F_CODE,
  TEMPLATE_DFDY_CODE,
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
} from "../features/CoreGraphController";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import type NonEmptyConnection from "../features/NonEmptyConnection";
import {
  addReactFlowNode,
  deselectLastSelectedNode,
  findRemovedEdges,
  getNewReactFlowNodePosition,
  getNonEmptyConnectionsFromEdges,
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
      operation: new Operation(ADD_F_CODE, ADD_DFDY_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Add two numbers $ a + b $",
    },
    {
      id: "sum",
      text: "Sum",
      type: "SIMPLE",
      operation: new Operation(SUM_F_CODE, SUM_DFDY_CODE),
      inputPorts: [new Port("x_i", true)],
      helpText: "Add all inputs $ \\sum_i x_{i} $",
    },
    {
      id: "product",
      text: "Product",
      type: "SIMPLE",
      operation: new Operation(PRODUCT_F_CODE, PRODUCT_DFDY_CODE),
      inputPorts: [new Port("x_i", true)],
      helpText: "Multiply all inputs $ \\prod_i x_{i} $",
    },
    {
      id: "squared_error",
      text: "Squared Error",
      type: "SIMPLE",
      operation: new Operation(SQUARED_ERROR_F_CODE, SQUARED_ERROR_DFDY_CODE),
      inputPorts: [new Port("y_estimate", false), new Port("y_true", false)],
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

  const findNodeIdToEmptyInputPortIds = useCallback(
    (removedConnections: NonEmptyConnection[]): Map<string, string> => {
      const nodeIdToEmptyInputPortIds = new Map<string, string>();
      if (coreGraph === null) {
        return nodeIdToEmptyInputPortIds;
      }

      removedConnections.forEach((removedConnection) => {
        if (
          isNodeInputPortEmpty(
            coreGraph,
            removedConnection.target,
            removedConnection.targetHandle,
          )
        ) {
          nodeIdToEmptyInputPortIds.set(
            removedConnection.target,
            removedConnection.targetHandle,
          );
        }
      });

      return nodeIdToEmptyInputPortIds;
    },
    [coreGraph],
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
      operation: new Operation(TEMPLATE_F_CODE, TEMPLATE_DFDY_CODE),
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

      const removedConnections = getNonEmptyConnectionsFromEdges(
        findRemovedEdges(changes, reactFlowEdges),
      );

      removedConnections.forEach((edge) => {
        disconnectCoreEdge(
          coreGraph,
          edge.source,
          edge.target,
          edge.targetHandle,
        );
      });

      const nodeIdToEmptyInputPortIds =
        findNodeIdToEmptyInputPortIds(removedConnections);

      nodeIdToEmptyInputPortIds.forEach((portId, nodeId) => {
        connectDummyInputNode(coreGraph, nodeId, portId);
      });

      setReactFlowNodes((nodes) =>
        showInputFields(nodeIdToEmptyInputPortIds, nodes),
      );

      updateNodeValuesAndDerivatives();

      setReactFlowEdges((edges) => applyEdgeChanges(changes, edges));
    },
    [
      coreGraph,
      findNodeIdToEmptyInputPortIds,
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
    (connection) => {
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

      connectCoreEdge(
        coreGraph,
        connection.source,
        connection.target,
        connection.targetHandle,
      );

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

        setReactFlowNodes((nodes) => hideInputField(connection, nodes));
      }

      updateNodeValuesAndDerivatives();

      setReactFlowEdges((edges) => addEdge(connection, edges));
    },
    [coreGraph, updateNodeValuesAndDerivatives],
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
      <Toolbar />
      <Grid
        container
        direction="row"
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
    </>
  );
};

export default GraphContainer;
