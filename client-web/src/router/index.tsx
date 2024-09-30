import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
const JobList = lazy(() => import("@pages/jobList"));
const Login = lazy(() => import("@pages/login"));
const JobOffers = lazy(() => import("@pages/jobOffers"));
const CollegeProfile = lazy(() => import("@/pages/profile/college"));
const CompanyProfile = lazy(() => import("@/pages/profile/company"));
const NotFound = lazy(() => import("@/pages/not-found"));

export const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/job-offers",
    element: <JobOffers />,
  },
  {
    path: "/perfil-estudante",
    element: <CollegeProfile />,
  },
  {
    path: "/perfil-empresa",
    element: <CompanyProfile />,
  },
  {
    path: "/job-list",
    element: <JobList />,
  },
]);