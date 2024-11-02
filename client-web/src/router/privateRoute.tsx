import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/stores/authStore";
import { UserStatus, UserType } from "@/domain/user";

const PrivateRoute = () => {
  const { user } = useAuthStore.getState();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.status != UserStatus.COMPLETE) {
    return <Navigate to={user.type == UserType.COLLEGE ? '/perfil-estudante' : '/perfil-empresa' } />;
  }

  return <Outlet />;
};

export default PrivateRoute;
