import Navbar from "@/components/ui/navbar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isRootPath = location.pathname === '/';

  return (
    <>
      {!isRootPath && <Navbar />} {/* Renderiza a Navbar somente se não estiver na rota "/" */}
      <Outlet />
    </>
  );
};

export default Layout;