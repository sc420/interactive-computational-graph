import { Box, Button, FormGroup, TextField, Typography } from "@mui/material";
import { useCallback, useState, type FunctionComponent } from "react";
import {
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type OnSelectionChangeParams,
  type XYPosition,
} from "reactflow";
import type FeatureNodeType from "../features/FeatureNodeType";

interface ReactFlowGraphMockProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onSelectionChange: (params: OnSelectionChangeParams) => void;
  onConnect: OnConnect;
  onDropNode: (featureNodeType: FeatureNodeType, position: XYPosition) => void;
}

const ReactFlowGraphMock: FunctionComponent<ReactFlowGraphMockProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onSelectionChange,
  onConnect,
  onDropNode,
}) => {
  // onNodesChange: remove
  const [jsonRemoveNodeIds, setJsonRemoveNodeIds] = useState<string>("");
  // onEdgesChange: remove
  const [jsonRemoveEdgeIds, setJsonRemoveEdgeIds] = useState<string>("");
  // onSelectionChange
  const [jsonSelectionChangeParams, setJsonSelectionChangeParams] =
    useState<string>("");
  // onConnect
  const [jsonConnection, setJsonConnection] = useState<string>("");
  // onDropNode
  const [jsonFeatureNodeType, setJsonFeatureNodeType] = useState<string>("");

  const idsJsonToRemoveList = useCallback((jsonIds: string) => {
    const ids = JSON.parse(jsonIds);
    return ids.map((id: string) => {
      return { type: "remove", id };
    });
  }, []);

  const handleOnNodesChangeRemove = useCallback((): void => {
    onNodesChange(idsJsonToRemoveList(jsonRemoveNodeIds));
  }, [idsJsonToRemoveList, onNodesChange, jsonRemoveNodeIds]);

  const handleOnEdgesChangeRemove = useCallback((): void => {
    onEdgesChange(idsJsonToRemoveList(jsonRemoveEdgeIds));
  }, [idsJsonToRemoveList, onEdgesChange, jsonRemoveEdgeIds]);

  const handleOnSelectionChange = useCallback((): void => {
    const params = JSON.parse(
      jsonSelectionChangeParams,
    ) as OnSelectionChangeParams;
    onSelectionChange(params);
  }, [jsonSelectionChangeParams, onSelectionChange]);

  const handleOnConnect = useCallback((): void => {
    const connection = JSON.parse(jsonConnection) as Connection;
    onConnect(connection);
  }, [jsonConnection, onConnect]);

  const handleOnDropNode = useCallback((): void => {
    const featureNodeType = JSON.parse(jsonFeatureNodeType) as FeatureNodeType;
    onDropNode(featureNodeType, {
      x: 100,
      y: 100,
    });
  }, [onDropNode, jsonFeatureNodeType]);

  return (
    <Box
      border={1}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={3}
      py={1.5}
    >
      <Box>
        <Typography variant="subtitle1">Graph Mock</Typography>
      </Box>

      {/* nodes and edges */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormGroup>
          {/* nodes */}
          <TextField
            label="jsonNodes"
            size="small"
            value={JSON.stringify(nodes)}
            InputProps={{
              readOnly: true,
            }}
          />

          {/* edges */}
          <TextField
            label="jsonEdges"
            size="small"
            value={JSON.stringify(edges)}
            InputProps={{
              readOnly: true,
            }}
          />
        </FormGroup>
      </Box>

      {/* onNodesChange: remove IDs */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormGroup>
          <TextField
            label="onNodesChange.remove.jsonIds"
            size="small"
            value={jsonRemoveNodeIds}
            onChange={(e) => {
              setJsonRemoveNodeIds(() => e.target.value);
            }}
          />
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: "none" }}
            onClick={handleOnNodesChangeRemove}
          >
            Trigger onNodesChange: remove
          </Button>
        </FormGroup>
      </Box>

      {/* onEdgesChange: remove IDs */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormGroup>
          <TextField
            label="onEdgesChange.remove.jsonIds"
            size="small"
            value={jsonRemoveEdgeIds}
            onChange={(e) => {
              setJsonRemoveEdgeIds(() => e.target.value);
            }}
          />
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: "none" }}
            onClick={handleOnEdgesChangeRemove}
          >
            Trigger onEdgesChange: remove
          </Button>
        </FormGroup>
      </Box>

      {/* onSelectionChange */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormGroup>
          <TextField
            label="onSelectionChange.jsonParams"
            size="small"
            value={jsonSelectionChangeParams}
            onChange={(e) => {
              setJsonSelectionChangeParams(() => e.target.value);
            }}
          />
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: "none" }}
            onClick={handleOnSelectionChange}
          >
            Trigger onSelectionChange
          </Button>
        </FormGroup>
      </Box>

      {/* onConnect */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormGroup>
          <TextField
            label="onConnect.jsonConnection"
            size="small"
            value={jsonConnection}
            onChange={(e) => {
              setJsonConnection(() => e.target.value);
            }}
          />
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: "none" }}
            onClick={handleOnConnect}
          >
            Trigger onConnect
          </Button>
        </FormGroup>
      </Box>

      {/* onDropNode: featureNodeType */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormGroup>
          <TextField
            label="onDropNode.jsonFeatureNodeType"
            size="small"
            value={jsonFeatureNodeType}
            onChange={(e) => {
              setJsonFeatureNodeType(() => e.target.value);
            }}
          />
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: "none" }}
            onClick={handleOnDropNode}
          >
            Trigger onDropNode
          </Button>
        </FormGroup>
      </Box>
    </Box>
  );
};

export default ReactFlowGraphMock;
