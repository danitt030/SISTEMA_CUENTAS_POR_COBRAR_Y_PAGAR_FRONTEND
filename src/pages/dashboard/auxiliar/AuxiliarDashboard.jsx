import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { RoleDashboardView } from "../../../components/Dashboard/RoleDashboardView";
import { useDashboardStats } from "../../../shared/hooks/useDashboardStats";
import { getModulesByRole } from "../../../utils/roleUtils";

export const AuxiliarDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const modules = getModulesByRole(user?.rol);
  const { stats, loading, error } = useDashboardStats(user?.rol);

  return (
    <>
      <Header />
      <RoleDashboardView
        title="Dashboard Auxiliar"
        greeting={`Bienvenido, ${user?.nombre} ${user?.apellido}`}
        subtitle="Seguimiento diario de clientes y facturas habilitadas para tu rol."
        modules={modules}
        stats={stats}
        loading={loading}
        error={error}
        metricKeys={["clientes", "facturas"]}
        chartTitle="Clientes y Facturas"
        chartDescription="Comparativo de volumen para gestion operativa del periodo."
        chartKeys={["clientes", "facturas"]}
        modulesDescription="Solo veras funciones permitidas para operaciones auxiliares."
        chartBadge="Mi informacion"
        onNavigate={navigate}
      />
    </>
  );
};
