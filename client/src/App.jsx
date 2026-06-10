import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Services = lazy(() => import('./pages/Services').then((m) => ({ default: m.Services })));
const Stylists = lazy(() => import('./pages/Stylists').then((m) => ({ default: m.Stylists })));
const Book = lazy(() => import('./pages/Book').then((m) => ({ default: m.Book })));
const Appointments = lazy(() => import('./pages/Appointments').then((m) => ({ default: m.Appointments })));
const Login = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Register })));

const fallback = <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#f5efe6' }}>Loading…</div>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={fallback}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="stylists" element={<Stylists />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="book" element={<Book />} />
              <Route
                path="appointments"
                element={
                  <ProtectedRoute>
                    <Appointments />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
