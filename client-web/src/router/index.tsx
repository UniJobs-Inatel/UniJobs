import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Auth = lazy(() => import("@pages/auth"));
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
    path: "/job-offers",
    element: <JobOffers />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);
