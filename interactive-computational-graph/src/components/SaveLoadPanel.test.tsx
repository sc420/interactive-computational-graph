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
    ],
    "nextNodeId": 3,
    "nodeNameBuilderState": {
        "constantCounter": 2,
        "variableCounter": 2,
        "operationIdToCounter": {
            "add": 2
        }
    },
    "nextOperationId": 0,
    "reactFlowState": {
        "nodes": [
            {
                "width": 182,
                "height": 96,
                "id": "0",
                "type": "custom",
                "data": {
                    "name": "c_1",
                    "operationData": null,
                    "featureNodeType": {
                        "nodeType": "CONSTANT"
                    },
                    "inputItems": [
                        {
                            "id": "value",
                            "label": "=",
                            "showHandle": false,
                            "showInputField": true,
                            "value": "1"
                        }
                    ],
                    "outputItems": [],
                    "isDarkMode": false,
                    "isHighlighted": false
                },
                "dragHandle": ".drag-handle",
                "selected": false,
                "position": {
                    "x": 10,
                    "y": 10
                },
                "positionAbsolute": {
                    "x": 10,
                    "y": 10
                }
            },
            {
                "width": 209,
                "height": 153,
                "id": "1",
                "type": "custom",
                "data": {
                    "name": "v_1",
                    "operationData": null,
                    "featureNodeType": {
                        "nodeType": "VARIABLE"
                    },
                    "inputItems": [
                        {
                            "id": "value",
                            "label": "=",
                            "showHandle": false,
                            "showInputField": true,
                            "value": "2"
                        }
                    ],
                    "outputItems": [
                        {
                            "type": "DERIVATIVE",
                            "labelParts": [
                                {
                                    "type": "latexLink",
                                    "id": "derivative",
                                    "latex": "\\displaystyle \\frac{\\partial{?}}{\\partial{v_1}}",
                                    "href": "1"
                                },
                                {
                                    "type": "latex",
                                    "id": "equal",
                                    "latex": "="
                                }
                            ],
                            "value": "0"
                        }
                    ],
                    "isDarkMode": false,
                    "isHighlighted": false
                },
                "dragHandle": ".drag-handle",
                "selected": false,
                "position": {
                    "x": 10,
                    "y": 150
                },
                "positionAbsolute": {
                    "x": 10,
                    "y": 150
                },
                "dragging": false
            },
            {
                "width": 209,
                "height": 233,
                "id": "2",
                "type": "custom",
                "data": {
                    "name": "a_1",
                    "operationData": {
                        "text": "Add",
                        "helpText": "Add two numbers, i.e., a + b"
                    },
                    "featureNodeType": {
                        "nodeType": "OPERATION",
                        "operationId": "add"
                    },
                    "inputItems": [
                        {
                            "id": "a",
                            "label": "a",
                            "showHandle": true,
                            "showInputField": false,
                            "value": "0"
                        },
                        {
                            "id": "b",
                            "label": "b",
                            "showHandle": true,
                            "showInputField": false,
                            "value": "0"
                        }
                    ],
                    "outputItems": [
                        {
                            "type": "VALUE",
                            "labelParts": [
                                {
                                    "type": "latex",
                                    "id": "value",
                                    "latex": "="
                                }
                            ],
                            "value": "3"
                        },
                        {
                            "type": "DERIVATIVE",
                            "labelParts": [
                                {
                                    "type": "latexLink",
                                    "id": "derivative",
                                    "latex": "\\displaystyle \\frac{\\partial{?}}{\\partial{a_1}}",
                                    "href": "2"
                                },
                                {
                                    "type": "latex",
                                    "id": "equal",
                                    "latex": "="
                                }
                            ],
                            "value": "0"
                        }
                    ],
                    "isDarkMode": false,
                    "isHighlighted": false
                },
                "dragHandle": ".drag-handle",
                "selected": false,
                "position": {
                    "x": 300,
                    "y": 0
                },
                "positionAbsolute": {
                    "x": 300,
                    "y": 0
                },
                "dragging": false
            }
        ],
        "edges": [
            {
                "source": "0",
                "sourceHandle": "output",
                "target": "2",
                "targetHandle": "a",
                "id": "reactflow__edge-0output-2a",
                "animated": false
            },
            {
                "source": "1",
                "sourceHandle": "output",
                "target": "2",
                "targetHandle": "b",
                "id": "reactflow__edge-1output-2b",
                "animated": false
            }
        ],
        "viewport": {
            "x": 150,
            "y": 100,
            "zoom": 1
        }
    }
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
  const mockConsole = jest.spyOn(console, "error").mockImplementation();

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

  expect(mockConsole).toHaveBeenCalled();

  jest.restoreAllMocks(); // restores the spy created with spyOn
});
