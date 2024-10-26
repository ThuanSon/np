import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { url } from "inspector";

interface RowData {
  id: number;
  name: string;
  type: string;
  expandType: string | null;
  kind: string;
  position: number;
  status: number;
}

const initialRows: RowData[] = [
  {
    id: 1,
    name: "big",
    type: "adjective",
    expandType: null,
    kind: "size",
    position: 3,
    status: 0,
  },
];

export default function DataGridDemo() {
  const [rows, setRows] = React.useState<RowData[]>(initialRows);
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<RowData | null>(null);
  // const [words, setWords] = React.useState<RowData[]>(initialRows)

  const fetchWords = async () => {
    const res = await axios.get(`http://localhost:3001/v1/words/0`);

    console.log(res?.data);
    setRows(res?.data);
  };
  React.useEffect(() => {
    fetchWords();
  }, [rows]);
  const handleEditClick = (row: RowData) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleSave = () => {
    if (selectedRow) {
      setRows(
        rows.map((row) => (row.id === selectedRow.id ? selectedRow : row))
      );
    }
    handleClose();
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedRow) {
      setSelectedRow({ ...selectedRow, [e.target.name]: e.target.value });
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150, editable: true },
    { field: "type", headerName: "Type", width: 110, editable: true },
    {
      field: "expandType",
      headerName: "Expand Type",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
    {
      field: "kind",
      headerName: "Kind",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
    {
      field: "position",
      headerName: "Position",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
    {
      field: "status",
      headerName: "Status",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      description: "Edit the row",
      sortable: false,
      width: 160,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditClick(params.row as RowData)}>
            <ModeEditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteClick(params.row.id as number)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
          }}
        >
          <h2>Edit Row</h2>
          <TextField
            label="Name"
            name="name"
            value={selectedRow?.name || ""}
            onChange={handleFieldChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Type"
            name="type"
            value={selectedRow?.type || ""}
            onChange={handleFieldChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Expand Type"
            name="expandType"
            value={selectedRow?.expandType || ""}
            onChange={handleFieldChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Kind"
            name="kind"
            value={selectedRow?.kind || ""}
            onChange={handleFieldChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Position"
            name="position"
            value={selectedRow?.position || ""}
            onChange={handleFieldChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Status"
            name="status"
            value={selectedRow?.status || ""}
            onChange={handleFieldChange}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
