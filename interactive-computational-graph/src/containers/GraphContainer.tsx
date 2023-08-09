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
import FeaturePanel from "../components/FeaturePanel";
import Graph from "../components/Graph";
import GraphToolbar from "../components/GraphToolbar";
import { TITLE_HEIGHT } from "../constants";
import GraphStateController from "../features/GraphStateController";
import type SelectedFeature from "../features/SelectedFeature";

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

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nodes) => graphStateController.handleNodesChange(changes, nodes));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((edges) => graphStateController.handleEdgesChange(changes, edges));
  }, []);

  const onConnect: OnConnect = useCallback((connection) => {
    setEdges((edges) => graphStateController.handleConnect(connection, edges));
  }, []);

  const onDropNode = useCallback((nodeType: string, position: XYPosition) => {
    setNodes((nodes) =>
      graphStateController.handleDropNode(nodeType, position, nodes),
    );
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
              onAddNode={graphStateController.addNode}
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
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDropNode={onDropNode}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default GraphContainer;
