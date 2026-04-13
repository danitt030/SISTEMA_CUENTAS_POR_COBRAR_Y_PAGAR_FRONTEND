import { Navigate } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { AdminDashboard } from "./pages/dashboard/admin/AdminDashboard";
import { GerenteGeneralDashboard } from "./pages/dashboard/gerenteGeneral/GerenteGeneralDashboard";
import { ContadorDashboard } from "./pages/dashboard/contador/ContadorDashboard";
import { GerenteDashboard } from "./pages/dashboard/gerente/GerenteDashboard";
import { VendedorDashboard } from "./pages/dashboard/vendedor/VendedorDashboard";
import { AuxiliarDashboard } from "./pages/dashboard/auxiliar/AuxiliarDashboard";
import { ClienteDashboard } from "./pages/dashboard/cliente/ClienteDashboard";
import { ClientesPage } from "./pages/clientes/ClientesPage";
import { ProveedoresPage } from "./pages/proveedores/ProveedoresPage";
import { FacturasCobrarPage } from "./pages/facturasPorCobrar/FacturasCobrarPage";
import { FacturasPagarPage } from "./pages/facturasPorPagar/FacturasPagarPage";
import { CobrosPage } from "./pages/cobros/CobrosPage";
import { PagosPage } from "./pages/pagos/PagosPage";
import { ReportesPage } from "./pages/reportes/ReportesPage";
import { UsuariosPage } from "./pages/usuarios/UsuariosPage";
import { AuditoriaPage } from "./pages/auditoria/AuditoriaPage";

export const routeConfig = [
  {
    path: "/auth",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/dashboard/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/dashboard/gerente-general",
    element: <GerenteGeneralDashboard />,
  },
  {
    path: "/dashboard/contador",
    element: <ContadorDashboard />,
  },
  {
    path: "/dashboard/gerente",
    element: <GerenteDashboard />,
  },
  {
    path: "/dashboard/vendedor",
    element: <VendedorDashboard />,
  },
  {
    path: "/dashboard/auxiliar",
    element: <AuxiliarDashboard />,
  },
  {
    path: "/dashboard/cliente",
    element: <ClienteDashboard />,
  },
  {
    path: "/clientes",
    element: <ClientesPage />,
  },
  {
    path: "/proveedores",
    element: <ProveedoresPage />,
  },
  {
    path: "/facturas-cobrar",
    element: <FacturasCobrarPage />,
  },
  {
    path: "/facturas-pagar",
    element: <FacturasPagarPage />,
  },
  {
    path: "/cobros",
    element: <CobrosPage />,
  },
  {
    path: "/pagos",
    element: <PagosPage />,
  },
  {
    path: "/reportes",
    element: <ReportesPage />,
  },
  {
    path: "/usuarios",
    element: <UsuariosPage />,
  },
  {
    path: "/auditoria",
    element: <AuditoriaPage />,
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
];
