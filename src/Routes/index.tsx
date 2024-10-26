import { lazy } from "react";
import Loadable from "../Components/Loadable";
import { Main } from "../Main";
import DataGridDemo from "../Adminstation";
// Lazily loaded components
// const Main = Loadable(lazy(() => import("../Main/index")));
// const Main = import("../Main/index");
// const DataGridDemo = Loadable(lazy(() => import("../Adminstation")));
// Define public routes
const publicRoute = [
  { path: "/*", component: Main, Layout: null },
  { path: "/admin", component: DataGridDemo, Layout: null },
];

export { publicRoute };
