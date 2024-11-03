import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { styled } from "@mui/material/styles";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Styled Alert for color transitions
const StyledAlert = styled(Alert)(({ theme }) => ({
  transition: "background-color 0.5s ease, color 0.5s ease",
}));

interface CustomSnackbarProps {
  snackbarOpen: boolean;
  handleSnackbarClose: () => void;
  snackbarMessage: string;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  snackbarOpen,
  handleSnackbarClose,
  snackbarMessage,
}) => {
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
    >
      <StyledAlert
        onClose={handleSnackbarClose}
        severity="success"
        sx={{
          bgcolor: "green",
          color: "white",
          "&.MuiAlert-filledSuccess": {
            bgcolor: "green",
            color: "white",
          },
          "&:hover": {
            bgcolor: "green",
            color: "white",
          },
          animation: snackbarOpen ? "fadeOut 6s forwards" : "none",
        }}
      >
        {snackbarMessage}
      </StyledAlert>
    </Snackbar>
  );
};

export default CustomSnackbar;
