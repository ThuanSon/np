import React, { useState } from "react";
import { Grid, OutlinedInput, Button, Typography } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import DecayStructure from "./decayStructure";

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
          alignItems: "center",
        }}
      >
        <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
          <OutlinedInput
            fullWidth
            multiline
            name="inputContent"
            value={inputContent}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
          <Button variant="contained" fullWidth onClick={handleButtonClick}>
            Decay
            <ArrowRightAltIcon />
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
          {/* <OutlinedInput fullWidth value={outputContent} /> */}
          <Typography>
            <DecayStructure data={outputContent} />
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};