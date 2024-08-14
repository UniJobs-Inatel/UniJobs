import { router } from "@/router/index";
import { RouterProvider } from "react-router-dom";

export function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}
