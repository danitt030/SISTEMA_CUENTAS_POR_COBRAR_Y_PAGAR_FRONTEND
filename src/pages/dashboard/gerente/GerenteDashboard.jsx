import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { RoleDashboardView } from "../../../components/Dashboard/RoleDashboardView";
import { useDashboardStats } from "../../../shared/hooks/useDashboardStats";
import { getModulesByRole } from "../../../utils/roleUtils";

export const GerenteDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const modules = getModulesByRole(user?.rol);
  const { stats, loading, error } = useDashboardStats(user?.rol);

  return (
    <>
      <Header />
      <RoleDashboardView
        title="Dashboard Gerente"
        greeting={`Bienvenido, ${user?.nombre} ${user?.apellido}`}
        subtitle="Seguimiento de cartera, facturacion y avance de cobranzas comerciales."
        modules={modules}
        stats={stats}
        loading={loading}
        error={error}
        metricKeys={["clientes", "facturas", "cobros"]}
        chartTitle="Facturas y Cobros"
        chartDescription="Indicadores principales para control del area comercial."
        chartKeys={["facturas", "cobros"]}
        modulesDescription="Solo se muestran modulos habilitados para este rol."
        onNavigate={navigate}
      />
    </>
  );
};
