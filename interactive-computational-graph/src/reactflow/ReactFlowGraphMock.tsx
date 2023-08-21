import { Box, Button, FormGroup, TextField, Typography } from "@mui/material";
import { useCallback, useState, type FunctionComponent } from "react";
import { type OnConnect } from "reactflow";

interface ReactFlowGraphMockProps {
  onConnect: OnConnect;
}

const ReactFlowGraphMock: FunctionComponent<ReactFlowGraphMockProps> = ({
  onConnect,
}) => {
  const [source, setSource] = useState<string>("");
  const [sourceHandle, setSourceHandle] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [targetHandle, setTargetHandle] = useState<string>("");

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

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormGroup>
          <TextField
            label="onConnect.source"
            size="small"
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
            }}
          />
          <TextField
            label="onConnect.sourceHandle"
            size="small"
            value={sourceHandle}
            onChange={(e) => {
              setSourceHandle(e.target.value);
            }}
          />
          <TextField
            label="onConnect.target"
            size="small"
            value={target}
            onChange={(e) => {
              setTarget(e.target.value);
            }}
          />
          <TextField
            label="onConnect.targetHandle"
            size="small"
            value={targetHandle}
            onChange={(e) => {
              setTargetHandle(e.target.value);
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
