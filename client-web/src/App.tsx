import { router } from "@/router/index";
import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";

export function App() {
  return (
    <main className="mx-auto ">
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </main>
  );
}