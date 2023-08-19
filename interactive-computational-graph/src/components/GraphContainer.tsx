import { Grid, Toolbar } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
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
  addCoreNode,
  connectCoreEdge,
  disconnectCoreEdge,
  removeCoreNode,
} from "../features/CoreGraphController";
import type FeatureOperation from "../features/FeatureOperation";
import {
  addReactFlowNode,
  deselectLastSelectedNode,
  getNewReactFlowNodePosition,
  selectReactFlowNode,
  updateLastSelectedNodeId,
} from "../features/ReactFlowController";
import type SelectedFeature from "../features/SelectedFeature";
import ReactFlowGraph from "../reactflow/ReactFlowGraph";
import FeaturePanel from "./FeaturePanel";
import GraphToolbar from "./GraphToolbar";

interface GraphContainerProps {
  selectedFeature: SelectedFeature | null;
}

const GraphContainer: React.FunctionComponent<GraphContainerProps> = ({
  selectedFeature,
}) => {
  const [coreGraph, setCoreGraph] = useState<Graph | null>(null);

  const [featureOperations, setFeatureOperations] = useState<
    FeatureOperation[]
  >([
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

  const [reactFlowNodes, setReactFlowNodes] = useState<Node[]>([]);
  const [reactFlowEdges, setReactFlowEdges] = useState<Edge[]>([]);
  const [lastSelectedNodeId, setLastSelectedNodeId] = useState<string | null>(
    null,
  );

  const handleInputChange = useCallback(
    (nodeId: string, inputPortId: string, value: string): void => {
      console.log(
        `nodeId:${nodeId}, inputPortId:${inputPortId}, value:${value}`,
      );
    },
    [],
  );

  const handleBodyClick = useCallback((nodeId: string): void => {
    setReactFlowNodes((nodes) => selectReactFlowNode(nodeId, nodes));
  }, []);

  const handleAddNode = useCallback(
    (nodeType: string) => {
      if (coreGraph === null) {
        return;
      }

      const id = `${nextNodeId}`;

      addCoreNode(coreGraph, nodeType, id, featureOperations);

      setReactFlowNodes((nodes) => {
        const position = getNewReactFlowNodePosition(nodes, lastSelectedNodeId);
        nodes = deselectLastSelectedNode(nodes, lastSelectedNodeId);
        return addReactFlowNode(
          nodeType,
          id,
          featureOperations,
          handleInputChange,
          handleBodyClick,
          position,
          nodes,
        );
      });

      setNextNodeId((nextNodeId) => nextNodeId + 1);
    },
    [coreGraph, featureOperations, nextNodeId, lastSelectedNodeId],
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

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      if (coreGraph === null) {
        return;
      }

      changes.forEach((change) => {
        switch (change.type) {
          case "remove": {
            removeCoreNode(change.id, coreGraph);
            break;
          }
        }
      });

      setReactFlowNodes((nodes) => applyNodeChanges(changes, nodes));
    },
    [coreGraph],
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      if (coreGraph === null) {
        return;
      }

      const removedEdgeIds = new Set<string>();
      changes.forEach((change) => {
        switch (change.type) {
          case "remove": {
            removedEdgeIds.add(change.id);
            break;
          }
        }
      });

      setReactFlowEdges((edges) => {
        edges.forEach((edge) => {
          if (removedEdgeIds.has(edge.id)) {
            if (
              edge.source === null ||
              edge.target === null ||
              edge.targetHandle === null ||
              edge.targetHandle === undefined
            ) {
              throw new Error(
                `Edge ${edge.id} should have source, target and targetHandle`,
              );
            }

            disconnectCoreEdge(
              coreGraph,
              edge.source,
              edge.target,
              edge.targetHandle,
            );
          }
        });

        return applyEdgeChanges(changes, edges);
      });
    },
    [coreGraph],
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

      setReactFlowEdges((edges) => addEdge(connection, edges));
    },
    [coreGraph],
  );

  const handleDropNode = useCallback(
    (nodeType: string, position: XYPosition) => {
      if (coreGraph === null) {
        return;
      }

      const id = `${nextNodeId}`;

      addCoreNode(coreGraph, nodeType, id, featureOperations);

      setReactFlowNodes((nodes) => {
        nodes = deselectLastSelectedNode(nodes, lastSelectedNodeId);
        return addReactFlowNode(
          nodeType,
          id,
          featureOperations,
          handleInputChange,
          handleBodyClick,
          position,
          nodes,
        );
      });

      setNextNodeId(nextNodeId + 1);
    },
    [coreGraph, nextNodeId, featureOperations],
  );

  useEffect(() => {
    const coreGraph = new Graph();
    setCoreGraph(coreGraph);
  }, []);

  return (
    <React.Fragment>
      <Toolbar />
      <Grid
        container
        direction="row"
        sx={{ height: `calc(100% - ${TITLE_HEIGHT}px)` }}
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
              <GraphToolbar />
            </Grid>
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
    </React.Fragment>
  );
};

export default GraphContainer;
