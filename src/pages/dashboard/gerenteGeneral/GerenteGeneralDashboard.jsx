import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { RoleDashboardView } from "../../../components/Dashboard/RoleDashboardView";
import { useDashboardStats } from "../../../shared/hooks/useDashboardStats";
import { getModulesByRole } from "../../../utils/roleUtils";

export const GerenteGeneralDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const modules = getModulesByRole(user?.rol);
  const { stats, loading, error } = useDashboardStats(user?.rol);

  return (
    <>
      <Header />
      <RoleDashboardView
        title="Dashboard Gerente General"
        greeting={`Bienvenido, ${user?.nombre} ${user?.apellido}`}
        subtitle="Vision integral de clientes, proveedores y flujo financiero de la organizacion."
        modules={modules}
        stats={stats}
        loading={loading}
        error={error}
        metricKeys={["clientes", "proveedores", "facturas", "cobros", "pagos"]}
        chartTitle="Cobros vs Pagos"
        chartDescription="Balance operativo entre ingresos y egresos del periodo actual."
        chartKeys={["cobros", "pagos"]}
        modulesDescription="Accesos directos habilitados para tu rol ejecutivo."
        onNavigate={navigate}
      />
    </>
  );
};
