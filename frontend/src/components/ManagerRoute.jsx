import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ManagerRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isAdmin || user.isManager) {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
};

export default ManagerRoute;
