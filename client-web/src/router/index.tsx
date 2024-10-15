/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import useAuthStore from '@/stores/authStore';

const JobList = lazy(() => import("@pages/jobList"));
const Login = lazy(() => import("@pages/login"));
const StudentProfile = lazy(() => import("@/pages/profile/student"));
const CompanyProfile = lazy(() => import("@/pages/profile/company"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PrivateRoute({ children }:{children:React.ReactNode}) {
  console.log('USER: ',useAuthStore.getState().user )
  return useAuthStore.getState().user  ? children : <Navigate to="/" />;
}

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
    path: "/perfil-estudante",
    element: <PrivateRoute><StudentProfile /></PrivateRoute>,
  },
  {
    path: "/perfil-empresa",
    element: <PrivateRoute><CompanyProfile /></PrivateRoute>,
  },
  {
    path: "/vagas",
    element: <PrivateRoute> <JobList /></PrivateRoute>,
  },
]);



