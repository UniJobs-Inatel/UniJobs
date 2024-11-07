import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/stores/authStore";
import { UserStatus, UserType } from "@/domain/user";


const allowedRoutes: { [key in UserType]: string[] } = {
  [UserType.COLLEGE]: ["/perfil-empresa", "/vagas-publicadas", "/cadastrar-vaga",],
  [UserType.COMPANY]: ["/perfil-empresa", "/vagas-publicadas", "/cadastrar-vaga",],
  [UserType.STUDENT]: ["/perfil-estudante",  "/vagas", "/vagas-favoritadas"],
};

const PrivateRoute = () => {
  const { user } = useAuthStore.getState();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.status != UserStatus.COMPLETE) {
     <Navigate to={user.type == UserType.COLLEGE ? '/perfil-estudante' : '/perfil-empresa' } />;
  }

  const isRouteAllowed = allowedRoutes[user.type]?.includes(location.pathname);
  if (!isRouteAllowed) {
    return <Navigate to="/perfil-empresa" />; // Redireciona para uma página de acesso negado
  }

  return <Outlet />;
};

export default PrivateRoute;
