import {
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
} from 'react-router-dom';

interface ProtectedRouteProps {
	  isAuth : boolean;
	  redirectPath?: string;
}

const ProtectedRoute = ({ isAuth, redirectPath = '/landing' } : ProtectedRouteProps) => {
  if (!isAuth) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;