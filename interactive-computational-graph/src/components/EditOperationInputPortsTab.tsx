import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Alert, Button, Container, Stack } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
  type GridColDef,
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
  onValidate: (isValid: boolean) => void;
}

const EditToolbar: FunctionComponent<EditToolbarProps> = ({
  setRows,
  setRowModesModel,
}) => {
  const handleClick = useCallback((): void => {
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
  }, [setRowModesModel, setRows]);

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
        portId: inputPort.getId().trim(),
        allowMultipleEdges: inputPort.isAllowMultiEdges() ? "Yes" : "No",
        isNew: false,
      };
    },
    [],
  );

  const initialRows = useMemo((): GridRowsProp<GridRowModelProps> => {
    return inputPorts.map((inputPort) => inputPortToRowModel(inputPort));
  }, [inputPortToRowModel, inputPorts]);

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const [rows, setRows] =
    useState<GridRowsProp<GridRowModelProps>>(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const rowsToInputPorts = useCallback((): Port[] => {
    return rows.map((row) => {
      return new Port(row.portId.trim(), row.allowMultipleEdges === "Yes");
    });
  }, [rows]);

  const handleEditClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel],
  );

  const handleSaveClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel],
  );

  const handleDeleteClick = useCallback(
    (id: GridRowId) => () => {
      setRows(rows.filter((row) => row.id !== id));
    },
    [rows],
  );

  const handleCancelClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });

      const editedRow = rows.find((row) => row.id === id);
      const isNew = editedRow?.isNew;
      if (isNew === true) {
        setRows(rows.filter((row) => row.id !== id));
      }
    },
    [rowModesModel, rows],
  );

  const handleRowModesModelChange = useCallback(
    (newRowModesModel: GridRowModesModel): void => {
      setRowModesModel(newRowModesModel);
    },
    [],
  );

  const processRowUpdate = useCallback(
    (
      newRow: GridRowModel<GridRowModelProps>,
    ): GridRowModel<GridRowModelProps> => {
      const updatedRow = { ...newRow, isNew: false };

      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    },
    [rows],
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "portId",
        headerName: "Port ID",
        description: "Port ID used in the code",
        width: 250,
        sortable: false,
        editable: true,
      },
      {
        field: "allowMultipleEdges",
        headerName: "Allow Multiple Edges",
        description: "Whether to allow multiple edges to connect to the port",
        width: 200,
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        sortable: false,
        editable: true,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
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
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
    [
      handleCancelClick,
      handleDeleteClick,
      handleEditClick,
      handleSaveClick,
      rowModesModel,
    ],
  );

  const getOldRows = useCallback(() => {
    return rows.filter((row) => !row.isNew);
  }, [rows]);

  const getEmptyRowsErrorMessages = useCallback((): string[] => {
    const oldRows = getOldRows();
    const errorMessages: string[] = [];
    if (oldRows.length === 0) {
      errorMessages.push("Please add at least one input port");
    }
    return errorMessages;
  }, [getOldRows]);

  const getInvalidPortIdErrorMessages = useCallback((): string[] => {
    const oldRows = getOldRows();
    const errorMessages: string[] = [];
    if (oldRows.some((row) => row.portId.trim() === "")) {
      errorMessages.push("Please enter non-empty input port");
    }
    return errorMessages;
  }, [getOldRows]);

  const getDuplicatePortIdsErrorMessages = useCallback((): string[] => {
    const oldRows = getOldRows();
    const portIdSet = new Set<string>();
    const errorMessages: string[] = [];
    oldRows.forEach((row) => {
      const portId = row.portId.trim();
      if (portIdSet.has(portId)) {
        errorMessages.push(`Duplicate port ID ${portId}`);
      } else {
        portIdSet.add(portId);
      }
    });
    return errorMessages;
  }, [getOldRows]);

  // Validate and update the values when input port changes
  useEffect(() => {
    const errorMessages: string[] = [];
    errorMessages.push(...getEmptyRowsErrorMessages());
    errorMessages.push(...getInvalidPortIdErrorMessages());
    errorMessages.push(...getDuplicatePortIdsErrorMessages());

    setErrorMessages(errorMessages);

    const isValid = errorMessages.length === 0;

    onValidate(isValid);

    if (!isValid) {
      return;
    }

    const editingInputPorts = rowsToInputPorts();
    onChangeValues(editingInputPorts);
  }, [
    getDuplicatePortIdsErrorMessages,
    getEmptyRowsErrorMessages,
    getInvalidPortIdErrorMessages,
    onChangeValues,
    onValidate,
    rowsToInputPorts,
  ]);

  return (
    isVisible && (
      <Container sx={{ height: "400px" }}>
        <Stack spacing={1}>
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            disableColumnMenu
          />
          {errorMessages.map((errorMessage, index) => (
            <Alert key={index} severity="error" sx={{ width: "100%" }}>
              {errorMessage}
            </Alert>
          ))}
        </Stack>
      </Container>
    )
  );
};

export default EditOperationInputPortsTab;
