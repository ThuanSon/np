import React, { Fragment } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Grid, OutlinedInput } from "@mui/material";
import PrimarySearchAppBar from "./Layout/AppBar";
import { Main } from "./Main";
import { publicRoute } from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {publicRoute.map((r, i) => {
            let Layout = r?.Layout === null ? Fragment : r?.Layout;
            let Page = r.component;
            return (
              <Route
                path={r?.path}
                key={i}
                element={
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <PrimarySearchAppBar />
                      </Grid>
                      <Grid item xs={12}>
                        <Page />
                      </Grid>
                    </Grid>
                  </>
                }
              ></Route>
            );
          })}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
