import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Container } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
  type GridColDef,
  type GridEventListener,
  type GridPreProcessEditCellProps,
  type GridRowId,
  type GridRowModel,
  type GridRowModesModel,
  type GridRowsProp,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FunctionComponent,
} from "react";
import Port from "../core/Port";

interface GridRowModelProps {
  id: string;
  portId: string;
  allowMultipleEdges: string;
  isNew: boolean;
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

interface EditOperationInputPortsTabProps {
  /**
   * Whether it's visible to users.
   *
   * If we render it in an inactive tab, DataGrid would complain about
   * width/height. See https://stackoverflow.com/a/72330389/18306596
   */
  isVisible: boolean;
  inputPorts: Port[];
  onChangeValues: (inputPort: Port[]) => void;
  onValidate: (hasError: boolean) => void;
}

const EditToolbar: FunctionComponent<EditToolbarProps> = ({
  setRows,
  setRowModesModel,
}) => {
  const handleClick = (): void => {
    const id = randomId();
    const newRow: GridRowModel<GridRowModelProps> = {
      id,
      portId: "",
      allowMultipleEdges: "No",
      isNew: true,
    };
    setRows((oldRows) => [...oldRows, newRow]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "portId" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Port
      </Button>
    </GridToolbarContainer>
  );
};

const EditOperationInputPortsTab: FunctionComponent<
  EditOperationInputPortsTabProps
> = ({ isVisible, inputPorts, onChangeValues, onValidate }) => {
  const inputPortToRowModel = useCallback(
    (inputPort: Port): GridRowModelProps => {
      return {
        id: randomId(),
        portId: inputPort.getId(),
        allowMultipleEdges: inputPort.isAllowMultiEdges() ? "Yes" : "No",
        isNew: false,
      };
    },
    [],
  );

  const rowModelToInputPort = useCallback((rowModel: GridRowModel): Port => {
    return new Port(rowModel.portId, rowModel.allowMultipleEdges === "Yes");
  }, []);

  const initialRows = useMemo((): GridRowsProp<GridRowModelProps> => {
    return inputPorts.map((inputPort) => inputPortToRowModel(inputPort));
  }, [inputPortToRowModel, inputPorts]);

  const [editingInputPorts, setEditingInputPorts] =
    useState<Port[]>(inputPorts);
  const [isEditingRow, setEditingRow] = useState(false);

  const [rows, setRows] =
    useState<GridRowsProp<GridRowModelProps>>(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStart: GridEventListener<"rowEditStart"> = (
    params,
    event,
  ) => {
    setEditingRow(true);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    setEditingRow(false);
  };

  const handleEditClick = (id: GridRowId) => () => {
    setEditingRow(true);

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setEditingRow(false);

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId, row: GridRowModel) => () => {
    // Delete the old input port
    setEditingInputPorts((inputPorts) =>
      inputPorts.filter((inputPort) => inputPort.getId() !== row.portId),
    );

    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setEditingRow(false);

    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    const isNew = editedRow?.isNew;
    if (isNew === true) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleRowModesModelChange = (
    newRowModesModel: GridRowModesModel,
  ): void => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (
    newRow: GridRowModel<GridRowModelProps>,
    oldRow: GridRowModel<GridRowModelProps>,
  ): GridRowModel<GridRowModelProps> => {
    const updatedRow = { ...newRow, isNew: false };

    // Update the old input port or insert new input port
    setEditingInputPorts((inputPorts) => {
      const oldInputPortIndex = inputPorts.findIndex(
        (inputPort) => inputPort.getId() === oldRow.portId,
      );
      const newPort = rowModelToInputPort(newRow);
      if (oldInputPortIndex >= 0) {
        inputPorts[oldInputPortIndex] = newPort;
      } else {
        inputPorts = inputPorts.concat(newPort);
      }
      return inputPorts;
    });

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns: GridColDef[] = [
    {
      field: "portId",
      headerName: "Port ID",
      description: "Port ID used in the code",
      width: 200,
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError = params.props.value.trim() === "";
        // TODO(sc420): Also check for duplicate portId
        // TODO(sc420): Show error message in snackbar
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "allowMultipleEdges",
      headerName: "Allow Multiple Edges",
      description: "Whether to allow multiple edges to connect to the port",
      width: 200,
      type: "singleSelect",
      valueOptions: ["Yes", "No"],
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id, row)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  // Validate the values when input port changes
  useEffect(() => {
    // TODO(sc420): Validate input ports (must have at least one row, must have port ID, no duplicates)

    const hasError = isEditingRow;

    onValidate(hasError);

    onChangeValues(editingInputPorts);
  }, [editingInputPorts, isEditingRow, onChangeValues, onValidate]);

  return (
    isVisible && (
      <Container sx={{ height: "400px" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          disableColumnMenu
        />
      </Container>
    )
  );
};

export default EditOperationInputPortsTab;
