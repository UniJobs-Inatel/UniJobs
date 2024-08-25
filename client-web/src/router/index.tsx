import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Login = lazy(() => import("@pages/login"));
const JobOffers = lazy(() => import("@pages/jobOffers"));
const Profile = lazy(() => import("@pages/profile"));
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
    path: "/perfil",
    element: <Profile />,
  },
]);