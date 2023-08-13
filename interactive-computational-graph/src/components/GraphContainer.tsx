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
import {
  PRODUCT_DFDY_CODE,
  PRODUCT_F_CODE,
  SQUARED_ERROR_DFDY_CODE,
  SQUARED_ERROR_F_CODE,
  SUM_DFDY_CODE,
  SUM_F_CODE,
} from "../features/BuiltInCode";
import GraphController from "../features/GraphController";
import type Operation from "../features/Operation";
import type SelectedFeature from "../features/SelectedFeature";
import Graph from "../reactflow/Graph";
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
  const [operations, setOperations] = useState<Operation[]>([
    {
      id: "sum",
      text: "Sum",
      type: "SIMPLE",
      fCode: SUM_F_CODE,
      dfdyCode: SUM_DFDY_CODE,
      inputPorts: ["x_i"],
      helpText: "Add all inputs $ \\sum_i x_{i} $",
    },
    {
      id: "product",
      text: "Product",
      type: "SIMPLE",
      fCode: PRODUCT_F_CODE,
      dfdyCode: PRODUCT_DFDY_CODE,
      inputPorts: ["x_i"],
      helpText: "Multiply all inputs $ \\prod_i x_{i} $",
    },
    {
      id: "squared_error",
      text: "Squared Error",
      type: "SIMPLE",
      fCode: SQUARED_ERROR_F_CODE,
      dfdyCode: SQUARED_ERROR_DFDY_CODE,
      inputPorts: ["y_estimate", "y_true"],
      helpText: "Calculates squared error $ (y_t - y_e)^2 $",
    },
  ]);

  const handleAddOperation = useCallback(() => {
    setOperations((operations) => graphController.addOperation(operations));
  }, []);

  const handleAddNode = useCallback((nodeType: string) => {
    setNodes((nodes) => graphController.addNode(nodeType, operations, nodes));
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
        graphController.dropNode(nodeType, position, operations, nodes),
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
              operations={operations}
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
              <Graph
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
