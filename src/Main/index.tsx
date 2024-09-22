import React, { lazy, useState } from "react";
import { Grid, OutlinedInput, Button, Typography } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Loadable from "../Components/Loadable";
import DecayStructure from "./decayStructure";
// const DecayStructure = Loadable((lazy(()=> import('./decayStructure'))))

export const Main: React.FC = () => {
  const [inputContent, setInputContent] = useState<string>("");
  const [outputContent, setOutputContent] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(event.target.value);
  };

  const handleButtonClick = () => {
    setOutputContent(inputContent);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          padding: "15px",
          display: "flex",
          justifyContent: "center",
          // alignItems: "center",
        }}
      >
        <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
          <OutlinedInput
            fullWidth
            rows={5}
            // multiline
            name="inputContent"
            value={inputContent}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
          <Button
            variant="contained"
            sx={{
              color: "white",
              // backgroundColor: "#FFDE01",
              background: 'linear-gradient(142deg, #d49279 30%, #efca91 70%)',
            }}
            fullWidth
            onClick={handleButtonClick}
          >
            Decay
            <ArrowRightAltIcon />
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          lg={5}
          xl={5}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <OutlinedInput fullWidth value={outputContent} /> */}
          <Typography>
            <DecayStructure data={outputContent} />
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};
