import Navbar from "@/components/ui/navbar";
import { cn } from "@/lib/cn";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isRootPath = location.pathname === '/';

  return (
    <>
      {!isRootPath && <Navbar />}
      <div className={cn(!isRootPath && "pt-[72px] px-4")} >
      <Outlet />
      </div>
    </>
  );
};

export default Layout;