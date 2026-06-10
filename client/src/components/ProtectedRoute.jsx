import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { styled } from '../styles/stitches.config';

const Loader = styled('div', {
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$gold',
  fontSize: '$lg',
});

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <Loader>Loading...</Loader>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return children;
};
