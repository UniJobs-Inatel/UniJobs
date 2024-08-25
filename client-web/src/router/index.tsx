import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Auth = lazy(() => import("@pages/auth"));
const JobList = lazy(() => import("@pages/jobList"));
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
    path: "/",
    element: <Auth />,
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
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/job-list",
    element: <JobList />,
  },
]);