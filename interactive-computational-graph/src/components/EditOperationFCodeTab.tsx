import { Editor } from "@monaco-editor/react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import {
  Box,
  Button,
  Container,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
  type SyntheticEvent,
} from "react";
import Operation from "../core/Operation";
import type Port from "../core/Port";
import MonacoEditorTestHelper from "../editor/MonacoEditorTestHelper";
import { randomInteger } from "../features/RandomUtilities";
import Katex from "../latex/Katex";
import EditOperationTabPanel from "./EditOperationTabPanel";

const isTest = process.env.NODE_ENV === "test";

interface EditOperationFCodeTabProps {
  fCode: string;
  inputPorts: Port[];
  isDarkMode: boolean;
  onChangeValues: (fCode: string) => void;
}

interface TestData {
  inputPortToNodes: string;
  inputNodeToValues: string;
}

const EditOperationFCodeTab: FunctionComponent<EditOperationFCodeTabProps> = ({
  fCode,
  inputPorts,
  isDarkMode,
  onChangeValues,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const getTabProps = useCallback((index: number): Record<string, string> => {
    return {
      id: `edit-f-code-tab-${index}`,
      "aria-controls": `edit-f-code-tabpanel-${index}`,
    };
  }, []);

  const handleTabChange = useCallback(
    (event: SyntheticEvent, newIndex: number): void => {
      setActiveTabIndex(newIndex);
    },
    [],
  );

  const [editingFCode, setEditingFCode] = useState(fCode);

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value === undefined) {
      return;
    }
    setEditingFCode(value);
  }, []);

  const buildRandomNodeIds = useCallback(
    (nextId: number, numNodes: number): string[] => {
      const nodeIds = Array.from(
        { length: numNodes },
        (_, index) => nextId + index,
      );
      return nodeIds.map((nodeId) => `${nodeId}`);
    },
    [],
  );

  const buildRandomInputPortToNodes = useCallback((): Record<
    string,
    string[]
  > => {
    const inputPortToNodes: Record<string, string[]> = {};
    let nextId = 0;
    inputPorts.forEach((inputPort) => {
      // Use only one node to avoid showing errors for those operations that
      // don't allow multiple input nodes
      const numNodes = 1;
      inputPortToNodes[inputPort.getId()] = buildRandomNodeIds(
        nextId,
        numNodes,
      );
      nextId += numNodes;
    });
    return inputPortToNodes;
  }, [buildRandomNodeIds, inputPorts]);

  const buildRandomInputNodeToValues = useCallback(
    (numNodes: number): Record<string, string> => {
      const inputNodeToValues: Record<string, string> = {};
      const nodeIds = Array.from(
        { length: numNodes },
        (_, index) => `${index}`,
      );
      nodeIds.forEach((nodeId) => {
        const value = randomInteger(-10, 10) / 10;
        inputNodeToValues[nodeId] = `${value}`;
      });
      return inputNodeToValues;
    },
    [],
  );

  const buildRandomTestData = useCallback((): TestData => {
    const inputPortToNodes = buildRandomInputPortToNodes();
    const numNodes = Object.values(inputPortToNodes).reduce(
      (count, nodes) => count + nodes.length,
      0,
    );
    const inputNodeToValues = buildRandomInputNodeToValues(numNodes);
    return {
      inputPortToNodes: JSON.stringify(inputPortToNodes, null, 4),
      inputNodeToValues: JSON.stringify(inputNodeToValues, null, 4),
    };
  }, [buildRandomInputNodeToValues, buildRandomInputPortToNodes]);

  const [testData, setTestData] = useState<TestData>(buildRandomTestData());
  const [testResult, setTestResult] = useState("");
  const [isTestResultError, setTestResultError] = useState(false);

  const handleInputPortToNodesChange = useCallback(
    (value: string | undefined) => {
      if (value === undefined) {
        return;
      }
      setTestData((testData) => {
        return {
          inputPortToNodes: value,
          inputNodeToValues: testData.inputNodeToValues,
        };
      });
    },
    [],
  );

  const handleInputNodeToValuesChange = useCallback(
    (value: string | undefined) => {
      if (value === undefined) {
        return;
      }
      setTestData((testData) => {
        return {
          inputPortToNodes: testData.inputPortToNodes,
          inputNodeToValues: value,
        };
      });
    },
    [],
  );

  const tryParseInputPortToNodes = useCallback((): any | null => {
    try {
      return JSON.parse(testData.inputPortToNodes);
    } catch (error) {
      if (!(error instanceof Error)) {
        throw new Error(`Unknown error type ${typeof error}`);
      }
      setTestResultError(true);
      const message = `\
Couldn't parse the input port to nodes data: ${error.message}
`;
      setTestResult(message);
      return null;
    }
  }, [testData.inputPortToNodes]);

  const tryParseInputNodeToValues = useCallback((): any | null => {
    try {
      return JSON.parse(testData.inputNodeToValues);
    } catch (error) {
      if (!(error instanceof Error)) {
        throw new Error(`Unknown error type ${typeof error}`);
      }
      setTestResultError(true);
      const message = `\
Couldn't parse the input node to values data: ${error.message}
`;
      setTestResult(message);
      return null;
    }
  }, [testData.inputNodeToValues]);

  const runTest = useCallback(() => {
    const operation = new Operation(editingFCode, "");

    const inputPortToNodes = tryParseInputPortToNodes();
    if (inputPortToNodes === null) {
      return;
    }
    const inputNodeToValues = tryParseInputNodeToValues();
    if (inputNodeToValues === null) {
      return;
    }

    try {
      const result = operation.evalF(inputPortToNodes, inputNodeToValues);
      setTestResultError(false);
      setTestResult(result);
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw new Error(`Unknown error type ${typeof error}`);
      }
      setTestResultError(true);
      setTestResult(error.message);
    }
  }, [editingFCode, tryParseInputNodeToValues, tryParseInputPortToNodes]);

  // Update values when the code changes
  useEffect(() => {
    onChangeValues(editingFCode);
  }, [editingFCode, onChangeValues]);

  return (
    <Container>
      <Stack direction="column" spacing={1}>
        {/* Tab navigator */}
        <Box borderBottom={1} borderColor="divider">
          <Tabs
            value={activeTabIndex}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Code" {...getTabProps(0)} />
            <Tab label="Test Data: Port To Nodes" {...getTabProps(1)} />
            <Tab label="Test Data: Node To Values" {...getTabProps(2)} />
          </Tabs>
        </Box>

        {/* Code */}
        <EditOperationTabPanel index={0} value={activeTabIndex}>
          <Stack py={1} spacing={1}>
            <Typography variant="h6" component="h1">
              Code for calculating <Katex latex="f()" />
            </Typography>
            <Box border={1} borderColor="grey.500">
              <Editor
                height="300px"
                theme={isDarkMode ? "vs-dark" : "light"}
                defaultLanguage="javascript"
                defaultValue={fCode}
                onChange={handleCodeChange}
              />

              {isTest && (
                <MonacoEditorTestHelper
                  testId="code"
                  onChange={handleCodeChange}
                />
              )}
            </Box>
          </Stack>
        </EditOperationTabPanel>

        {/* Test data: Input port to nodes */}
        <EditOperationTabPanel index={1} value={activeTabIndex}>
          <Stack py={1} spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" component="h1">
                Test data: Input port to nodes
              </Typography>
              <Tooltip
                title={
                  <div>
                    Key: Input port ID
                    <br />
                    Value: List of all connected input node IDs
                  </div>
                }
                placement="right"
              >
                <HelpOutlineIcon color="primary" />
              </Tooltip>
            </Stack>
            <Box border={1} borderColor="grey.500">
              <Editor
                height="300px"
                theme={isDarkMode ? "vs-dark" : "light"}
                defaultLanguage="json"
                value={testData.inputPortToNodes}
                onChange={handleInputPortToNodesChange}
              />

              {isTest && (
                <MonacoEditorTestHelper
                  testId="inputPortToNodes"
                  value={testData.inputPortToNodes}
                  onChange={handleInputPortToNodesChange}
                />
              )}
            </Box>
          </Stack>
        </EditOperationTabPanel>

        {/* Test data: Input node to values */}
        <EditOperationTabPanel index={2} value={activeTabIndex}>
          <Stack py={1} spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" component="h1">
                Test data: Input node to values
              </Typography>
              <Tooltip
                title={
                  <div>
                    Key: Input node ID from &quot;PORT TO NODES&quot; data
                    <br />
                    Value: Input node value
                  </div>
                }
                placement="right"
              >
                <HelpOutlineIcon color="primary" />
              </Tooltip>
            </Stack>

            <Box border={1} borderColor="grey.500">
              <Editor
                height="300px"
                theme={isDarkMode ? "vs-dark" : "light"}
                defaultLanguage="json"
                value={testData.inputNodeToValues}
                onChange={handleInputNodeToValuesChange}
              />

              {isTest && (
                <MonacoEditorTestHelper
                  testId="inputNodeToValues"
                  value={testData.inputNodeToValues}
                  onChange={handleInputNodeToValuesChange}
                />
              )}
            </Box>
          </Stack>
        </EditOperationTabPanel>

        {/* Test buttons */}
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={1}
          py={1}
        >
          <Tooltip
            title="Run the f() code with the two test data"
            placement="right"
          >
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={() => {
                runTest();
              }}
            >
              Run Test
            </Button>
          </Tooltip>

          <Tooltip title="Randomize the two test data" placement="left">
            <Button
              variant="outlined"
              startIcon={<ShuffleIcon />}
              onClick={() => {
                setTestData(buildRandomTestData());
              }}
            >
              Randomize Test Data
            </Button>
          </Tooltip>
        </Stack>

        {/* Test result */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" component="h1">
            Test result
          </Typography>
          {isTestResultError && (
            <Tooltip
              data-testid="errorTooltip"
              title="An error occurs while running the test"
              placement="right"
            >
              <ErrorOutlineIcon color="error" />
            </Tooltip>
          )}
        </Stack>
        <Box border={1} borderColor="grey.500">
          <Editor
            height="200px"
            theme={isDarkMode ? "vs-dark" : "light"}
            options={{
              readOnly: true,
            }}
            value={testResult}
          />

          {isTest && (
            <MonacoEditorTestHelper testId="testResult" value={testResult} />
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default EditOperationFCodeTab;
