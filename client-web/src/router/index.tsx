/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";

const Layout = lazy(() => import("@/components/ui/layout"));
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./privateRoute";

const Login = lazy(() => import("@pages/login"));
const JobList = lazy(() => import("@pages/jobList"));
const PublishedJobs = lazy(() => import("@pages/publishedJobs"));
const FavoriteJobs = lazy(() => import("@pages/favoriteJobs"));
const JobForm = lazy(() => import("@pages/jobForm"));
const StudentProfile = lazy(() => import("@/pages/profile/student"));
const CompanyProfile = lazy(() => import("@/pages/profile/company"));
const NotFound = lazy(() => import("@/pages/not-found"));


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
        element: <PrivateRoute />,
        children: [
          { path: "/perfil-estudante", element: <StudentProfile /> },
          { path: "/perfil-empresa", element: <CompanyProfile /> },
          { path: "/vagas", element: <JobList /> },
          {
            path: "/cadastrar-vaga",
            element: <JobForm />,
          },
          {
            path: "/vagas-publicadas",
            element: <PublishedJobs />,
          },
          {
            path: "/vagas-favoritadas",
            element: <FavoriteJobs />,
          },
        ],
      },
    ],
  },
]);
