import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { RoleDashboardView } from "../../../components/Dashboard/RoleDashboardView";
import { useDashboardStats } from "../../../shared/hooks/useDashboardStats";
import { getModulesByRole } from "../../../utils/roleUtils";

export const ContadorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const modules = getModulesByRole(user?.rol);
  const { stats, loading, error } = useDashboardStats(user?.rol);

  return (
    <>
      <Header />
      <RoleDashboardView
        title="Dashboard Contador"
        greeting={`Bienvenido, ${user?.nombre} ${user?.apellido}`}
        subtitle="Control financiero de facturas, pagos y flujo operativo contable."
        modules={modules}
        stats={stats}
        loading={loading}
        error={error}
        metricKeys={["facturas", "cobros", "pagos", "proveedores"]}
        chartTitle="Pagos y Cobros"
        chartDescription="Comparativo de transacciones principales del periodo."
        chartKeys={["cobros", "pagos"]}
        modulesDescription="Navegacion por modulos permitidos para funciones contables."
        onNavigate={navigate}
      />
    </>
  );
};
