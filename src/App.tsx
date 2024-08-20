import React from "react";
import "./App.css";
import { Grid, OutlinedInput } from "@mui/material";
import PrimarySearchAppBar from "./Layout/AppBar";
import { Main } from "./Main";

function App() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PrimarySearchAppBar />
        </Grid>
        <Grid item xs={12}>
          <Main />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
