import { fireEvent, render, screen } from "@testing-library/react";
import SaveLoadPanel from "./SaveLoadPanel";

// Don't actually save the file
jest.mock("file-saver");

const successMessage = "The file has been loaded successfully.";
const errorMessage =
  "An error has occurred while loading the file. See the developer console for details.";

test("should trigger the event when clicking the save button", () => {
  const handleSave = jest.fn();
  const handleLoad = jest.fn();
  render(<SaveLoadPanel onSave={handleSave} onLoad={handleLoad} />);

  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);
  expect(handleSave).toBeCalledWith();
});

test("should trigger the event when clicking the load button", async () => {
  const handleSave = jest.fn();
  const handleLoad = jest.fn();
  render(<SaveLoadPanel onSave={handleSave} onLoad={handleLoad} />);

  const contents = `\
{
    "coreGraphAdapterState": {
        "coreGraphState": {
            "nodeIdToNodes": {
                "0": {
                    "nodeType": "CONSTANT",
                    "value": "1",
                    "relationship": {
                        "inputPortIdToNodeIds": {}
                    }
                },
                "1": {
                    "nodeType": "VARIABLE",
                    "value": "2",
                    "relationship": {
                        "inputPortIdToNodeIds": {}
                    }
                },
                "2": {
                    "nodeType": "OPERATION",
                    "operationId": "add",
                    "relationship": {
                        "inputPortIdToNodeIds": {
                            "a": [
                                "0"
                            ],
                            "b": [
                                "1"
                            ]
                        }
                    }
                },
                "dummy-input-node-2-a": {
                    "nodeType": "CONSTANT",
                    "value": "0",
                    "relationship": {
                        "inputPortIdToNodeIds": {}
                    }
                },
                "dummy-input-node-2-b": {
                    "nodeType": "CONSTANT",
                    "value": "0",
                    "relationship": {
                        "inputPortIdToNodeIds": {}
                    }
                }
            },
            "differentiationMode": "REVERSE",
            "targetNodeId": null
        },
        "nodeIdToNames": {
            "0": "c_1",
            "1": "v_1",
            "2": "a_1",
            "dummy-input-node-2-a": "a_1.a",
            "dummy-input-node-2-b": "a_1.b"
        },
        "dummyInputNodeIdToNodeIds": {
            "dummy-input-node-2-a": "2",
            "dummy-input-node-2-b": "2"
        }
    },
    "isReverseMode": true,
    "derivativeTarget": null,
    "featureOperations": [
        {
            "id": "add",
            "text": "Add",
            "type": "basic",
            "namePrefix": "a",
            "operation": {
                "fCode": "function f(fInputPortToNodes, fInputNodeToValues) { return '0'; }",
                "dfdxCode": "function dfdx(fInputPortToNodes, fInputNodeToValues, xId) { return '0'; }"
            },
            "inputPorts": [
                {
                    "id": "a",
                    "allowMultiEdges": false
                },
                {
                    "id": "b",
                    "allowMultiEdges": false
                }
            ],
            "helpText": "Add two numbers, i.e., a + b"
        }
    ]
}
`;
  const file = new File([contents], "graph.json", { type: "text/plain" });
  const fileInput = screen.getByLabelText("Load file");
  fireEvent.change(fileInput, { target: { files: [file] } });

  await screen.findByText(successMessage);

  expect(handleLoad).toHaveBeenCalled();
  const errorAlert = screen.queryByText(errorMessage);
  expect(errorAlert).not.toBeInTheDocument();
});

test("should show the error message when the file contents is not valid", async () => {
  const handleSave = jest.fn();
  const handleLoad = jest.fn();
  render(<SaveLoadPanel onSave={handleSave} onLoad={handleLoad} />);

  const contents = "{abc}";
  const file = new File([contents], "graph.json", { type: "text/plain" });
  const fileInput = screen.getByLabelText("Load file");
  fireEvent.change(fileInput, { target: { files: [file] } });

  await screen.findByText(errorMessage);

  expect(handleLoad).not.toHaveBeenCalled();
  const successAlert = screen.queryByText(successMessage);
  expect(successAlert).not.toBeInTheDocument();
});
