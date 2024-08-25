/*import React from 'react';
import AppRoutes from './routes/Routes';

const App: React.FC = () => (
  <div>
    <AppRoutes />
  </div>
);

export default App;*/

import { router } from "@/router/index";
import { RouterProvider } from "react-router-dom";

export function App() {
  return (
    <main className="mx-auto max-w-[1024px] px-4 pt-3" >
      <RouterProvider router={router} />
    </main>
  );
}
