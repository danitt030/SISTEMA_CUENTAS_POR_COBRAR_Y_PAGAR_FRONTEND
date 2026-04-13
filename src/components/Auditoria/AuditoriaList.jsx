import { useState } from "react";
import Pagination from "../Common/Pagination";
import ActionBadge from "./ActionBadge";
import ModuloBadge from "./ModuloBadge";
import AuditoriaDetail from "./AuditoriaDetail";
import "./auditoriaList.css";

const AuditoriaList = ({ logs, paginaInfo, onPaginaChange, loading }) => {
    const [logSeleccionado, setLogSeleccionado] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleString("es-GT", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    const abrirDetalle = (log) => {
        setLogSeleccionado(log);
        setMostrarDetalle(true);
    };

    const cerrarDetalle = () => {
        setMostrarDetalle(false);
        setLogSeleccionado(null);
    };

    if (loading) {
        return <div className="loading-spinner">Cargando logs...</div>;
    }

    if (!logs || logs.length === 0) {
        return (
            <div className="auditoria-empty">
                <p>📋 No hay registros de auditoría</p>
            </div>
        );
    }

    return (
        <div className="auditoria-list-container">
            <div className="auditoria-table-wrapper">
                <table className="auditoria-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Acción</th>
                            <th>Módulo</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td>
                                    <strong>{log.usuario?.usuario || "N/A"}</strong>
                                    <br />
                                    <small>{log.usuario?.correo || "N/A"}</small>
                                </td>
                                <td>
                                    <ActionBadge accion={log.accion} />
                                </td>
                                <td>
                                    <ModuloBadge modulo={log.modulo} />
                                </td>
                                <td className="auditoria-descripcion">
                                    {log.descripcion}
                                </td>
                                <td>
                                    <span className={`status-badge status-${log.estado?.toLowerCase()}`}>
                                        {log.estado}
                                    </span>
                                </td>
                                <td>
                                    <small>{formatearFecha(log.timestamp)}</small>
                                </td>
                                <td>
                                    <button
                                        className="btn-detalle"
                                        onClick={() => abrirDetalle(log)}
                                        title="Ver detalles"
                                    >
                                        👁️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {paginaInfo && (
                <Pagination
                    pagina={paginaInfo.pagina}
                    totalPaginas={paginaInfo.totalPages}
                    onPaginaChange={onPaginaChange}
                />
            )}

            {mostrarDetalle && logSeleccionado && (
                <AuditoriaDetail log={logSeleccionado} onClose={cerrarDetalle} />
            )}
        </div>
    );
};

export default AuditoriaList;
