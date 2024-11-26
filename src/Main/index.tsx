import React, { lazy, useState } from "react";
import { Grid, OutlinedInput, Button, Typography } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Loadable from "../Components/Loadable";
import DecayStructure from "./decayStructure";
// const DecayStructure = Loadable((lazy(()=> import('./decayStructure'))))

export const Main: React.FC = () => {
  const [inputContent, setInputContent] = useState<string>("");
  const [outputContent, setOutputContent] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const IContainer = document.getElementById("image");
    if (IContainer) {
      IContainer.innerHTML = "";
    }
    setInputContent(event.target.value);
  };
  let dataSplited = inputContent.split(",").map((d) => d.trim());
  console.log("dataSplited", dataSplited);

  // dataSplited.forEach((item) => {
  //   if (item === "") {
  //     dataSplited.slice;
  //   }
  // });
  console.log("dataSplited", dataSplited);

  const handleButtonClick = () => {
    setOutputContent(dataSplited);
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

          <div style={{ lineHeightStep: 4, paddingTop: "50px" }}>
            <i>
              * The field above allows multiple Noun Phrase inputs separated by
              a comma ","
            </i>
            <br />
            <i>
              * If there are two couples of compound nouns or more, must use "-"
              to connect two nouns to represent the relationship (ex: the
              child-poverty action-group)
            </i>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
          <Button
            variant="contained"
            sx={{
              color: "white",
              // backgroundColor: "#FFDE01",
              background: "linear-gradient(142deg, #d49279 30%, #efca91 70%)",
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
