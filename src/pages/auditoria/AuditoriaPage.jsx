import { useEffect, useRef, useCallback, useContext } from "react";
import { useAuditoria } from "../../shared/hooks/useAuditoria.jsx";
import { useAuditoriaSocket } from "../../shared/hooks/useAuditoriaSocket.jsx";
import AuditoriaSearch from "../../components/Auditoria/AuditoriaSearch.jsx";
import AuditoriaList from "../../components/Auditoria/AuditoriaList.jsx";
import "../reportes/reportesPage.css";
import { AuthContext } from "../../context/AuthContext";
import { puedeVerAuditoria } from "../../utils/roleUtils";

const AuditoriaPage = () => {
    const { user } = useContext(AuthContext);
    const {
        logs,
        loading,
        error,
        paginaInfo,
        obtenerLogsFunc,
        filtrarPorFechaYAccionFunc,
        exportarLogsFunc
    } = useAuditoria();

    const paginaActualRef = useRef(1);

    // Callback para cuando llega un nuevo evento de auditoría
    const handleNuevaAuditoria = useCallback(() => {
        // Recargar la primera página para ver el nuevo evento
        obtenerLogsFunc(1, 50);
        paginaActualRef.current = 1;
    }, [obtenerLogsFunc]);

    // Usar WebSocket para escuchar eventos en tiempo real
    useAuditoriaSocket(handleNuevaAuditoria);

    useEffect(() => {
        // Cargar logs inicialmente (solo una vez al montar)
        obtenerLogsFunc(1, 50);
    }, [obtenerLogsFunc]);

    const handleFiltrar = async (filtros) => {
        if (!filtros.fechaInicio && !filtros.fechaFin && !filtros.accion) {
            // Si no hay filtros, traer todos
            obtenerLogsFunc(1, 50);
            paginaActualRef.current = 1;
        } else {
            // Aplicar filtros
            await filtrarPorFechaYAccionFunc(
                filtros.fechaInicio || null,
                filtros.fechaFin || null,
                filtros.accion || null,
                1,
                50
            );
            paginaActualRef.current = 1;
        }
    };

    const handleExportar = async (filtros) => {
        await exportarLogsFunc(
            filtros.fechaInicio || null,
            filtros.fechaFin || null,
            filtros.accion || null
        );
    };

    const handlePaginaChange = (nuevaPagina) => {
        paginaActualRef.current = nuevaPagina;
        obtenerLogsFunc(nuevaPagina, 50);
    };

    // ==================== VERIFICACIÓN DE RBAC ====================
    const tieneAcceso = puedeVerAuditoria(user?.rol);

    if (!tieneAcceso) {
        return (
            <div className="page-container">
                <div className="alert alert-danger" style={{ margin: "20px" }}>
                    <strong>Acceso Denegado</strong>
                    <p>No tienes permisos para acceder al módulo de Auditoría. Solo administradores pueden ver el registro de cambios del sistema.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📋 Auditoría del Sistema</h1>
                <p>Visualiza en tiempo real todos los cambios realizados en el sistema 🔴 (WebSocket activo)</p>
            </div>

            {error && (
                <div className="alert alert-error">
                    ❌ {error}
                </div>
            )}

            <AuditoriaSearch
                onFiltrar={handleFiltrar}
                onExportar={handleExportar}
                loading={loading}
            />

            <AuditoriaList
                logs={logs}
                paginaInfo={paginaInfo}
                onPaginaChange={handlePaginaChange}
                loading={loading}
            />
        </div>
    );
};

export default AuditoriaPage;
