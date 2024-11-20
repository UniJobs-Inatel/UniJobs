import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { allowedRoutes } from "@/router/privateRoute";
import useAuthStore from "@/stores/authStore";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Para navegar após o logout
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useAuthStore()

  const navLinks = [
    { path: "/vagas", label: "Lista de Vagas" },
    { path: "/perfil-estudante", label: "Perfil do Estudante" },
    { path: "/perfil-empresa", label: "Perfil da Empresa" },
    { path: "/cadastrar-vaga", label: "Cadastrar Vaga" },
    { path: "/vagas-publicadas", label: "Vagas Publicadas" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
    navigate("/");
  };

  return (
    <nav className="bg-primary p-4 shadow-lg fixed top-0 left-0 w-screen z-50">
      <div className="flex items-center justify-between mx-auto">
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? 'Fechar' : 'Menu'}
        </button>
        
        <ul className={`flex-col md:flex-row md:space-x-6 items-center justify-center ${isOpen ? 'flex mr-10' : 'hidden md:flex'}`}>
          {user && navLinks.filter((link) => allowedRoutes[user.type]?.includes(link.path) ) .map((link) => (
            <li key={link.path} className="my-2 md:my-0">
              <Link
                to={link.path}
                className={cn(
                  "text-white font-medium transition duration-300 ease-in-out transform hover:text-gray-300 hover:scale-105",
                  location.pathname === link.path
                    ? "underline underline-offset-4 text-gray-300"
                    : "no-underline"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 text-white font-medium transition duration-300 ease-in-out transform hover:text-gray-300 hover:scale-105"
        >
          Sair
        </button>
      </div>
    </nav>
  );
};

export default NavBar;