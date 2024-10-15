import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
const JobList = lazy(() => import("@pages/jobList"));
const Login = lazy(() => import("@pages/login"));
const JobOffers = lazy(() => import("@pages/jobOffers"));
const JobForm = lazy(() => import("@pages/jobForm"));
const StudentProfile = lazy(() => import("@/pages/profile/student"));
const CompanyProfile = lazy(() => import("@/pages/profile/company"));
const NotFound = lazy(() => import("@/pages/not-found"));

export const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/job-offers",
    element: <JobOffers />,
  },
  {
    path: "/perfil-estudante",
    element: <StudentProfile />,
  },
  {
    path: "/perfil-empresa",
    element: <CompanyProfile />,
  },
  {
    path: "/job-list",
    element: <JobList />,
  },
  {
    path: "/job-form",
    element: <JobForm />,
  },
]);