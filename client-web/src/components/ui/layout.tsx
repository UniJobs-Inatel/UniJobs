import Navbar from "@/components/ui/navbar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isRootPath = location.pathname === '/';

  return (
    <>
      {!isRootPath && <Navbar />}
      <div className="pt-[60px]" >
      <Outlet />
      </div>
    </>
  );
};

export default Layout;