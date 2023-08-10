import { Grid, Toolbar } from "@mui/material";
import React, { useCallback, useState } from "react";
import {
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type XYPosition,
} from "reactflow";
import { TITLE_HEIGHT } from "../constants";
import {
  PRODUCT_DFDY_CODE,
  PRODUCT_F_CODE,
  SUM_DFDY_CODE,
  SUM_F_CODE,
} from "../features/BuiltInCode";
import GraphStateController from "../features/GraphStateController";
import type Operation from "../features/Operation";
import type SelectedFeature from "../features/SelectedFeature";
import FeaturePanel from "./FeaturePanel";
import Graph from "./Graph";
import GraphToolbar from "./GraphToolbar";

interface GraphContainerProps {
  selectedFeature: SelectedFeature | null;
}

const GraphContainer: React.FunctionComponent<GraphContainerProps> = ({
  selectedFeature,
}) => {
  const [graphStateController] = useState(new GraphStateController());

  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "-1",
      data: { label: "Hello" },
      position: { x: 0, y: 0 },
      type: "input",
    },
    {
      id: "-2",
      data: { label: "World" },
      position: { x: 100, y: 100 },
    },
  ]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [operations] = useState<Operation[]>([
    {
      id: "Sum",
      category: "SIMPLE",
      fCode: SUM_F_CODE,
      dfdyCode: SUM_DFDY_CODE,
      inputPorts: ["x_i"],
      helpText: "Sum all inputs $ \\sum_i x_{i} $",
    },
    {
      id: "Product",
      category: "SIMPLE",
      fCode: PRODUCT_F_CODE,
      dfdyCode: PRODUCT_DFDY_CODE,
      inputPorts: ["x_i"],
      helpText: "Sum all inputs $ \\sum_i x_{i} $",
    },
  ]);

  const handleNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nodes) => graphStateController.changeNodes(changes, nodes));
  }, []);

  const handleEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((edges) => graphStateController.changeEdges(changes, edges));
  }, []);

  const handleConnect: OnConnect = useCallback((connection) => {
    setEdges((edges) => graphStateController.connect(connection, edges));
  }, []);

  const handleDropNode = useCallback(
    (nodeType: string, position: XYPosition) => {
      setNodes((nodes) =>
        graphStateController.dropNode(nodeType, position, nodes),
      );
    },
    [],
  );

  const handleAddNode = useCallback((nodeType: string) => {
    setNodes((nodes) => graphStateController.addNode(nodeType, nodes));
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
          <Grid item borderRight="1px solid" borderColor="divider">
            <FeaturePanel
              feature={selectedFeature}
              operations={operations}
              onAddNode={handleAddNode}
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
