import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "notistack";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "13px",
          backgroundColor: "black",
          color: "white",
          fontWeight: "bold",
          padding: "8px",
        },
        arrow: {
          color: "black",
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
