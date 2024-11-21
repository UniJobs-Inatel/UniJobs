import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import Modals from "./components/ui/modal";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App/>
    <Modals />
  </React.StrictMode>
);
