import { Box, Button, FormGroup, TextField, Typography } from "@mui/material";
import { useCallback, useState, type FunctionComponent } from "react";
import {
  type OnNodesChange,
  type OnConnect,
  type OnEdgesChange,
} from "reactflow";

interface ReactFlowGraphMockProps {
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

const ReactFlowGraphMock: FunctionComponent<ReactFlowGraphMockProps> = ({
  onNodesChange,
  onEdgesChange,
  onConnect,
}) => {
  // onNodesChange: remove
  const [jsonRemoveNodeIds, setJsonRemoveNodeIds] = useState<string>("");
  // onEdgesChange: remove
  const [jsonRemoveEdgeIds, setJsonRemoveEdgeIds] = useState<string>("");
  // onConnect
  const [source, setSource] = useState<string>("");
  const [sourceHandle, setSourceHandle] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [targetHandle, setTargetHandle] = useState<string>("");

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

  const handleOnConnect = useCallback((): void => {
    onConnect({
      source,
      sourceHandle,
      target,
      targetHandle,
    });
  }, [onConnect, source, sourceHandle, target, targetHandle]);

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
        <Typography fontWeight="500">Graph Mock</Typography>
      </Box>

      {/* onNodesChange: remove */}
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

      {/* onEdgesChange: remove */}
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

      {/* onConnect */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormGroup>
          <TextField
            label="onConnect.source"
            size="small"
            value={source}
            onChange={(e) => {
              setSource(() => e.target.value);
            }}
          />
          <TextField
            label="onConnect.sourceHandle"
            size="small"
            value={sourceHandle}
            onChange={(e) => {
              setSourceHandle(() => e.target.value);
            }}
          />
          <TextField
            label="onConnect.target"
            size="small"
            value={target}
            onChange={(e) => {
              setTarget(() => e.target.value);
            }}
          />
          <TextField
            label="onConnect.targetHandle"
            size="small"
            value={targetHandle}
            onChange={(e) => {
              setTargetHandle(() => e.target.value);
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
    </Box>
  );
};

export default ReactFlowGraphMock;
