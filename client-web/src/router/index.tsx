/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";

const Layout = lazy(() => import("@/components/ui/layout"));
import { createBrowserRouter, Navigate } from "react-router-dom";
import useAuthStore from "@/stores/authStore";
import { createJob } from "@/services/job/job";

const JobList = lazy(() => import("@pages/jobList"));
const Login = lazy(() => import("@pages/login"));
const JobForm = lazy(() => import("@pages/jobForm"));
const StudentProfile = lazy(() => import("@/pages/profile/student"));
const CompanyProfile = lazy(() => import("@/pages/profile/company"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return useAuthStore.getState().user ? children : <Navigate to="/" />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "",
        element: <Login />,
      },
      {
        path: "/perfil-estudante",
        element: (
          <PrivateRoute>
            <StudentProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/perfil-empresa",
        element: (
          <PrivateRoute>
            <CompanyProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/vagas",
        element: (
          <PrivateRoute>
            {" "}
            <JobList />
          </PrivateRoute>
        ),
      },
      {
        path: "/cadastrar-vaga",
        element: <JobForm addNewJob={createJob} />,
      },
    ],
  },
]);
