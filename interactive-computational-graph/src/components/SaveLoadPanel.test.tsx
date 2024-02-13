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
  "isReverseMode": true,
  "derivativeTarget": null
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
