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

function AppContent() {
  const routeElements = useRoutes(routes);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            background: "#f8fafc",
            color: "#0f172a",
            fontWeight: 600,
            boxShadow: "0 14px 30px rgba(15, 23, 42, 0.2)",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ecfdf5",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fef2f2",
            },
          },
        }}
      />
      {routeElements}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
