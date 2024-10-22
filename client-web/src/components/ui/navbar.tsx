import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { path: "/job-list", label: "Lista de Vagas" },
    { path: "/perfil-estudante", label: "Perfil do Estudante" },
    { path: "/perfil-empresa", label: "Perfil da Empresa" },
    { path: "/job-form", label: "Cadastrar Vaga" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-primary p-4 shadow-lg w-full">
      <div className="flex items-center justify-between mx-auto">
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? 'Fechar' : 'Menu'}
        </button>
        <ul className={`flex-col md:flex-row md:space-x-6 items-center justify-center ${isOpen ? 'flex' : 'hidden md:flex'}`}>
          {navLinks.map((link) => (
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
      </div>
    </nav>
  );
};

export default NavBar;