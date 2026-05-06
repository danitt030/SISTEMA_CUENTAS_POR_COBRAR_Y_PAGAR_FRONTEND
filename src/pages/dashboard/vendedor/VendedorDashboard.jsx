import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { RoleDashboardView } from "../../../components/Dashboard/RoleDashboardView";
import { useDashboardStats } from "../../../shared/hooks/useDashboardStats";
import { getModulesByRole } from "../../../utils/roleUtils";

export const VendedorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const modules = getModulesByRole(user?.rol);
  const { stats, loading, error } = useDashboardStats(user?.rol);

  return (
    <>
      <Header />
      <RoleDashboardView
        title="Dashboard Vendedor"
        greeting={`Bienvenido, ${user?.nombre} ${user?.apellido}`}
        subtitle="Monitorea tu desempeno comercial en clientes, facturacion y cobros."
        modules={modules}
        stats={stats}
        loading={loading}
        error={error}
        metricKeys={["clientes", "facturas", "cobros"]}
        chartTitle="Facturas y Cobros"
        chartDescription="Vista comercial de conversion y recuperacion del periodo."
        chartKeys={["facturas", "cobros"]}
        modulesDescription="Atajos de trabajo segun permisos del rol vendedor."
        chartBadge="Mi desempeno"
        onNavigate={navigate}
      />
    </>
  );
};
