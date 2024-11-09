import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar
import Alert from "@mui/material/Alert"; // Import Alert for Snackbar styling
import Dialog from "@mui/material/Dialog"; // Import Dialog for confirmation
import DialogActions from "@mui/material/DialogActions"; // Import DialogActions for buttons
import DialogContent from "@mui/material/DialogContent"; // Import DialogContent for the dialog's content
import DialogTitle from "@mui/material/DialogTitle"; // Import DialogTitle for the dialog's title
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

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
  const nav = useNavigate();
  React.useEffect(() => {
    let ut = localStorage.getItem("user-token");
    if (!ut || ut === null) {
      nav("/login");
    }
  }, []);

  const [rows, setRows] = React.useState<RowData[]>();
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<RowData | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [rowToDelete, setRowToDelete] = React.useState<number | null>(null);

  const fetchWords = async () => {
    try {
      const token = localStorage.getItem("user-token");
      const res = await axios.get(
        `http://localhost:3001/v1/words/1?deleted=0`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRows(res?.data);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  React.useEffect(() => {
    fetchWords();
  }, []);

  const handleEditClick = (row: RowData) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setRowToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (rowToDelete !== null) {
      let token = localStorage.getItem("user-token");
      try {
        await axios.delete(`http://localhost:3001/v1/words/${rowToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRows(rows?.filter((row) => row.id !== rowToDelete));
        setSnackbarMessage("Row successfully deleted!");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Failed to delete the word:", error);
        setSnackbarMessage("Failed to delete the row!");
        setSnackbarOpen(true);
      }
    }
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleSave = async () => {
    if (selectedRow) {
      try {
        let token = localStorage.getItem("user-token");
        const res = await axios.put(`http://localhost:3001/v1/words/`, selectedRow, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRows(
          rows?.map((row) => (row.id === selectedRow.id ? selectedRow : row))
        );
        setSnackbarMessage(res?.data?.message);
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Failed to update the word:", error);
      }
    }
    handleClose();
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedRow) {
      setSelectedRow({ ...selectedRow, [e.target.name]: e.target.value });
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "type", headerName: "Type", width: 110 },
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
      description: "Edit or delete the row",
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
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20]}
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

      {/* Confirmation dialog for delete */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this row?</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ width: "50%" }}
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            sx={{ width: "50%" }}
            onClick={confirmDelete}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
