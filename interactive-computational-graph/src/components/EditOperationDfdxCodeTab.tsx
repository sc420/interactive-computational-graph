import { Editor } from "@monaco-editor/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
import {
  buildRandomInputNodeToValues,
  buildRandomInputPortToNodes,
  getNumNodesInInputPortToNodes,
} from "../features/RandomTestDataGenerator";
import { randomInteger } from "../features/RandomUtilities";
import Katex from "../latex/Katex";
import EditOperationTabPanel from "./EditOperationTabPanel";

const isTest = process.env.NODE_ENV === "test";

interface EditOperationDfdxCodeTabProps {
  dfdxCode: string;
  inputPorts: Port[];
  isDarkMode: boolean;
  onChangeValues: (dfdxCode: string) => void;
}

interface TestData {
  inputPortToNodes: string;
  inputNodeToValues: string;
  xId: string;
}

const EditOperationDfdxCodeTab: FunctionComponent<
  EditOperationDfdxCodeTabProps
> = ({ dfdxCode, inputPorts, isDarkMode, onChangeValues }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const getTabProps = useCallback((index: number): Record<string, string> => {
    return {
      id: `edit-dfdx-code-tab-${index}`,
      "aria-controls": `edit-dfdx-code-tabpanel-${index}`,
    };
  }, []);

  const handleTabChange = useCallback(
    (event: SyntheticEvent, newIndex: number): void => {
      setActiveTabIndex(newIndex);
    },
    [],
  );

  const [editingDfdxCode, setEditingDfdxCode] = useState(dfdxCode);

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value === undefined) {
      return;
    }
    setTestResultUpToDate(false);
    setEditingDfdxCode(value);
  }, []);

  const buildRandomXId = useCallback((numNodes: number): string => {
    if (numNodes <= 0) {
      return "0";
    }
    // 50% chance to be one of the input nodes
    const xId = randomInteger(0, 2 * numNodes - 1);
    return `${xId}`;
  }, []);

  const buildRandomTestData = useCallback((): TestData => {
    const inputPortToNodes = buildRandomInputPortToNodes(inputPorts);
    const numNodes = getNumNodesInInputPortToNodes(inputPortToNodes);
    const inputNodeToValues = buildRandomInputNodeToValues(numNodes);
    const xId = buildRandomXId(numNodes);
    return {
      inputPortToNodes: JSON.stringify(inputPortToNodes, null, 4),
      inputNodeToValues: JSON.stringify(inputNodeToValues, null, 4),
      xId,
    };
  }, [buildRandomXId, inputPorts]);

  const [testData, setTestData] = useState<TestData>(buildRandomTestData());
  const [testResult, setTestResult] = useState("");
  const [isTestResultUpToDate, setTestResultUpToDate] = useState(false);
  const [testResultDate, setTestResultDate] = useState(new Date());
  const [isTestResultError, setTestResultError] = useState(false);

  const handleInputPortToNodesChange = useCallback(
    (value: string | undefined) => {
      if (value === undefined) {
        return;
      }
      setTestResultUpToDate(false);
      setTestData((testData) => {
        return {
          inputPortToNodes: value,
          inputNodeToValues: testData.inputNodeToValues,
          xId: testData.xId,
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
      setTestResultUpToDate(false);
      setTestData((testData) => {
        return {
          inputPortToNodes: testData.inputPortToNodes,
          inputNodeToValues: value,
          xId: testData.xId,
        };
      });
    },
    [],
  );

  const handleXIdChange = useCallback((value: string | undefined) => {
    if (value === undefined) {
      return;
    }
    setTestResultUpToDate(false);
    setTestData((testData) => {
      return {
        inputPortToNodes: testData.inputPortToNodes,
        inputNodeToValues: testData.inputNodeToValues,
        xId: value,
      };
    });
  }, []);

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
    const operation = new Operation("", editingDfdxCode);

    const inputPortToNodes = tryParseInputPortToNodes();
    if (inputPortToNodes === null) {
      return;
    }
    const inputNodeToValues = tryParseInputNodeToValues();
    if (inputNodeToValues === null) {
      return;
    }

    try {
      const result = operation.evalDfdx(
        inputPortToNodes,
        inputNodeToValues,
        testData.xId,
      );
      setTestResultUpToDate(true);
      setTestResultDate(new Date());
      setTestResultError(false);
      setTestResult(result);
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw new Error(`Unknown error type ${typeof error}`);
      }
      setTestResultUpToDate(false);
      setTestResultError(true);
      setTestResult(error.message);
    }
  }, [
    editingDfdxCode,
    testData.xId,
    tryParseInputNodeToValues,
    tryParseInputPortToNodes,
  ]);

  // Update values when the code changes
  useEffect(() => {
    onChangeValues(editingDfdxCode);
  }, [editingDfdxCode, onChangeValues]);

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
            <Tab label="Test Data: X ID" {...getTabProps(3)} />
          </Tabs>
        </Box>

        {/* Code */}
        <EditOperationTabPanel index={0} value={activeTabIndex}>
          <Stack py={1} spacing={1}>
            <Typography variant="h6" component="h1">
              Code for calculating <Katex latex="\partial{f}/\partial{x}" />
            </Typography>
            <Box border={1} borderColor="grey.500">
              <Editor
                height="300px"
                theme={isDarkMode ? "vs-dark" : "light"}
                defaultLanguage="javascript"
                defaultValue={dfdxCode}
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

        {/* Test data: X ID */}
        <EditOperationTabPanel index={3} value={activeTabIndex}>
          <Stack py={1} spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" component="h1">
                Test data: X ID
              </Typography>
              <Tooltip
                title={
                  <div>
                    The <Katex latex="x" /> in{" "}
                    <Katex latex="\partial{f}/\partial{x}" />
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
                value={testData.xId}
                onChange={handleXIdChange}
              />

              {isTest && (
                <MonacoEditorTestHelper
                  testId="xId"
                  value={testData.xId}
                  onChange={handleXIdChange}
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
            title="Run the df/dx code with the three test data"
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

          <Tooltip title="Randomize the three test data" placement="left">
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
          {isTestResultUpToDate && (
            <Tooltip
              data-testid="upToDateTooltip"
              title={`Generated at ${testResultDate.toString()}`}
              placement="right"
            >
              <CheckCircleIcon color="primary" />
            </Tooltip>
          )}
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

export default EditOperationDfdxCodeTab;
