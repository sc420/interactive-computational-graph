import { Grid, Toolbar } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import {
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type OnSelectionChangeParams,
  type XYPosition,
} from "reactflow";
import { TITLE_HEIGHT } from "../constants";
import Operation from "../core/Operation";
import Port from "../core/Port";
import {
  PRODUCT_DFDY_CODE,
  PRODUCT_F_CODE,
  SQUARED_ERROR_DFDY_CODE,
  SQUARED_ERROR_F_CODE,
  SUM_DFDY_CODE,
  SUM_F_CODE,
} from "../features/BuiltInCode";
import type FeatureOperation from "../features/FeatureOperation";
import GraphController from "../features/GraphController";
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
  const [graphController] = useState(new GraphController());

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
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

  const handleAddOperation = useCallback(() => {
    setFeatureOperations((operations) =>
      graphController.addOperation(operations),
    );
  }, []);

  const handleAddNode = useCallback((nodeType: string) => {
    setNodes((nodes) =>
      graphController.addNode(nodeType, featureOperations, nodes),
    );
  }, []);

  const handleNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nodes) => graphController.changeNodes(changes, nodes));
  }, []);

  const handleEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((edges) => graphController.changeEdges(changes, edges));
  }, []);

  const handleSelectionChange = useCallback(
    (params: OnSelectionChangeParams): void => {
      graphController.updateSelectedNodes(params.nodes);
    },
    [],
  );

  const handleConnect: OnConnect = useCallback((connection) => {
    setEdges((edges) => graphController.connect(connection, edges));
  }, []);

  const handleDropNode = useCallback(
    (nodeType: string, position: XYPosition) => {
      setNodes((nodes) =>
        graphController.dropNode(nodeType, position, featureOperations, nodes),
      );
    },
    [],
  );

  useEffect(() => {
    const handleBodyClick = (id: string): void => {
      setNodes((nodes) => graphController.handleBodyClick(id, nodes));
    };

    graphController.setOnBodyClick(handleBodyClick);
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
                nodes={nodes}
                edges={edges}
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
