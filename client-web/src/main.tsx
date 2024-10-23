import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="mx-auto max-w-[1024px] px-4 pt-3" >
      <RouterProvider router={router} />
    </main>
  </React.StrictMode>
);
