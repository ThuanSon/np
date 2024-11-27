// material-ui
import { styled } from "@mui/material/styles";
import CircularProgress from '@mui/material/CircularProgress';

// styles
const LoaderWrapper = styled("div")({
  // position: "fixed",
  // top: "50%",
  // left: 0,
  // zIndex: 1301,
  // width: "100%",
  // height: "15px",
});

// ==============================|| LOADER ||============================== //

const Loader = () => (
  <LoaderWrapper>
    <CircularProgress color="warning" />
  </LoaderWrapper>
);

export default Loader;
