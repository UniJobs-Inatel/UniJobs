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
    <main>
      <RouterProvider router={router} />
    </main>
  );
}
