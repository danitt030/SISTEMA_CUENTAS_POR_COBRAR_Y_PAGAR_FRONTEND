import { BrowserRouter as Router, useRoutes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import routesConfig from "./Routes";
import { Toaster } from "react-hot-toast";

// Componente para proteger rutas
const Protected = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Agregar protección a rutas privadas
const routes = routesConfig.map((route) => {
  if (route.path === "/auth" || route.path === "/" || route.path === "*") {
    return route;
  }

  return {
    ...route,
    element: <Protected>{route.element}</Protected>,
  };
});

function App() {
  const routeElements = useRoutes(routes);

  return (
    <>
      <Toaster position="top-right" />
      {routeElements}
    </>
  );
}


export default function AppWithRouter() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}
