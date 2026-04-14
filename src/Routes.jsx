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
import { ClientePortalPage } from "./pages/clientes/ClientePortalPage";
import { MiPerfilPage } from "./pages/miPerfil/MiPerfilPage";
import { ProveedoresPage } from "./pages/proveedores/ProveedoresPage";
import { FacturasCobrarPage } from "./pages/facturasPorCobrar/FacturasCobrarPage";
import { FacturasPagarPage } from "./pages/facturasPorPagar/FacturasPagarPage";
import { CobrosPage } from "./pages/cobros/CobrosPage";
import { PagosPage } from "./pages/pagos/PagosPage";
import { ReportesPage } from "./pages/reportes/ReportesPage";
import { UsuariosPage } from "./pages/usuarios/UsuariosPage";
import AuditoriaPage from "./pages/auditoria/AuditoriaPage";
import { IAMainPage } from "./pages/ia/IAMainPage";
import { IAClientePage } from "./pages/ia/IAClientePage";
import { IAFacturasPage } from "./pages/ia/IAFacturasPage";
import { IACobroPage } from "./pages/ia/IACobroPage";
import { IAReportesPage } from "./pages/ia/IAReportesPage";

// Configuración de rutas
const routes = [
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
    path: "/cliente-portal",
    element: <ClientePortalPage />,
  },
  {
    path: "/mi-perfil/:uid",
    element: <MiPerfilPage />,
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
    path: "/ia",
    element: <IAMainPage />,
  },
  {
    path: "/ia/cliente",
    element: <IAClientePage />,
  },
  {
    path: "/ia/facturas",
    element: <IAFacturasPage />,
  },
  {
    path: "/ia/cobros",
    element: <IACobroPage />,
  },
  {
    path: "/ia/reportes",
    element: <IAReportesPage />,
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

export default routes;
