import { useEffect, useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuditoria } from "../../shared/hooks/useAuditoria.jsx";
import { useAuditoriaSocket } from "../../shared/hooks/useAuditoriaSocket.jsx";
import AuditoriaSearch from "../../components/Auditoria/AuditoriaSearch.jsx";
import AuditoriaList from "../../components/Auditoria/AuditoriaList.jsx";
import { AuthContext } from "../../context/AuthContext";
import { Header } from "../../components/Layout/Header";
import { puedeVerAuditoria } from "../../utils/roleUtils";
import "../../styles/modules.css";

const AuditoriaPage = () => {
    const navigate = useNavigate();
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

    const handleFiltrar = useCallback(async (filtros) => {
        // Verificar si hay algún filtro activo
        const tieneFilter = (
            (filtros.fechaInicio && filtros.fechaInicio !== "" && filtros.fechaInicio !== null) ||
            (filtros.fechaFin && filtros.fechaFin !== "" && filtros.fechaFin !== null) ||
            (filtros.accion && filtros.accion !== "" && filtros.accion !== null)
        );

        if (!tieneFilter) {
            // Si no hay filtros, traer todos
            obtenerLogsFunc(1, 50);
            paginaActualRef.current = 1;
        } else {
            await filtrarPorFechaYAccionFunc(
                filtros.fechaInicio && filtros.fechaInicio !== null ? filtros.fechaInicio : "",
                filtros.fechaFin && filtros.fechaFin !== null ? filtros.fechaFin : "",
                filtros.accion && filtros.accion !== null ? filtros.accion : "",
                1,
                50
            );
            paginaActualRef.current = 1;
        }
    }, [obtenerLogsFunc, filtrarPorFechaYAccionFunc]);

    const handleExportar = useCallback(async (filtros) => {
        await exportarLogsFunc(
            filtros.fechaInicio || null,
            filtros.fechaFin || null,
            filtros.accion || null
        );
    }, [exportarLogsFunc]);

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
        <>
            <Header />
            <div className="module-container auditoria-page-v2">
                <div className="auditoria-hero">
                    <div className="auditoria-hero-main">
                        <div className="auditoria-hero-top">
                            <button
                                onClick={() => navigate(-1)}
                                className="btn btn-secondary"
                            >
                                ← Volver
                            </button>
                            <span className="auditoria-live-badge">Tiempo real activo</span>
                        </div>

                        <h1 className="auditoria-title">Auditoría del Sistema</h1>
                        <p className="auditoria-subtitle">
                            Supervisa acciones de usuarios, cambios críticos y eventos del sistema con trazabilidad completa.
                        </p>
                    </div>

                    <div className="auditoria-hero-stats">
                        <article className="auditoria-stat-card">
                            <p className="auditoria-stat-label">Registros cargados</p>
                            <p className="auditoria-stat-value">{logs?.length || 0}</p>
                        </article>
                        <article className="auditoria-stat-card">
                            <p className="auditoria-stat-label">Total histórico</p>
                            <p className="auditoria-stat-value">{paginaInfo?.total || 0}</p>
                        </article>
                        <article className="auditoria-stat-card">
                            <p className="auditoria-stat-label">Página actual</p>
                            <p className="auditoria-stat-value">{paginaInfo?.pagina || 1}</p>
                        </article>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <AuditoriaSearch
                    onFiltrar={handleFiltrar}
                    onExportar={handleExportar}
                    loading={loading}
                />

                <section className="auditoria-content-panel">
                    <AuditoriaList
                        logs={logs}
                        paginaInfo={paginaInfo}
                        onPaginaChange={handlePaginaChange}
                        loading={loading}
                    />
                </section>
            </div>
        </>
    );
};

export default AuditoriaPage;
