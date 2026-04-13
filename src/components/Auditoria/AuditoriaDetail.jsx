import Modal from "../Common/Modal";
import ActionBadge from "./ActionBadge";
import ModuloBadge from "./ModuloBadge";
import "./auditoriaDetail.css";

const AuditoriaDetail = ({ log, onClose }) => {
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

    const renderJson = (obj) => {
        if (!obj || Object.keys(obj).length === 0) {
            return <p className="no-data">Sin cambios registrados</p>;
        }

        return (
            <div className="json-viewer">
                {Object.entries(obj).map(([key, value]) => (
                    <div key={key} className="json-item">
                        <span className="json-key">{key}:</span>
                        <span className="json-value">
                            {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Detalles de Auditoría">
            <div className="auditoria-detail">
                {/* Header Info */}
                <div className="detail-header">
                    <div className="detail-row">
                        <div className="detail-col">
                            <label>Usuario</label>
                            <p>
                                <strong>{log.usuario?.usuario || "N/A"}</strong>
                                <br />
                                <small>{log.usuario?.correo || "N/A"}</small>
                            </p>
                        </div>
                        <div className="detail-col">
                            <label>Acción</label>
                            <p>
                                <ActionBadge accion={log.accion} />
                            </p>
                        </div>
                        <div className="detail-col">
                            <label>Módulo</label>
                            <p>
                                <ModuloBadge modulo={log.modulo} />
                            </p>
                        </div>
                    </div>

                    <div className="detail-row">
                        <div className="detail-col full">
                            <label>Descripción</label>
                            <p>{log.descripcion}</p>
                        </div>
                    </div>

                    <div className="detail-row">
                        <div className="detail-col">
                            <label>Estado</label>
                            <p>
                                <span className={`status-badge status-${log.estado?.toLowerCase()}`}>
                                    {log.estado}
                                </span>
                            </p>
                        </div>
                        <div className="detail-col">
                            <label>Fecha</label>
                            <p>{formatearFecha(log.timestamp)}</p>
                        </div>
                    </div>

                    {log.ipAddress && (
                        <div className="detail-row">
                            <div className="detail-col">
                                <label>IP Address</label>
                                <p>{log.ipAddress}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Cambios Antes/Después */}
                <div className="detail-changes">
                    <div className="changes-section">
                        <h3>📋 Valores Anteriores</h3>
                        {renderJson(log.detallesAntes)}
                    </div>

                    <div className="changes-section">
                        <h3>✅ Valores Nuevos</h3>
                        {renderJson(log.detallesDespues)}
                    </div>
                </div>

                {/* Footer */}
                <div className="detail-footer">
                    <button className="btn-close" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AuditoriaDetail;
