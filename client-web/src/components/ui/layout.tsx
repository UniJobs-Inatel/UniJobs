import Navbar from "@/components/ui/navbar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isRootPath = location.pathname === '/';

  return (
    <>
      {!isRootPath && <Navbar />}
      <Outlet />
    </>
  );
};

export default Layout;