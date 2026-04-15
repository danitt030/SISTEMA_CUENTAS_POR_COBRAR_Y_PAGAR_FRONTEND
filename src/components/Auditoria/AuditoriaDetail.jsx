import Modal from "../Common/Modal";
import ActionBadge from "./ActionBadge";
import ModuloBadge from "./ModuloBadge";

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
                            {typeof value === "object"
                                ? JSON.stringify(value, null, 2)
                                : String(value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Detalles de Auditoría"
            overlayClassName="auditoria-detail-modal-overlay"
            contentClassName="modal-content-large auditoria-detail-modal"
            bodyClassName="auditoria-detail-modal-body"
        >
            <div className="auditoria-detail-v2 form-readable">
                <div className="auditoria-detail-header-grid">
                    <div className="auditoria-detail-block">
                        <label>Usuario</label>
                        <p>
                            <strong>{log.usuario?.usuario || "N/A"}</strong>
                            <br />
                            <small>{log.usuario?.correo || "N/A"}</small>
                        </p>
                    </div>
                    <div className="auditoria-detail-block">
                        <label>Acción</label>
                        <p>
                            <ActionBadge accion={log.accion} />
                        </p>
                    </div>
                    <div className="auditoria-detail-block">
                        <label>Módulo</label>
                        <p>
                            <ModuloBadge modulo={log.modulo} />
                        </p>
                    </div>
                    <div className="auditoria-detail-block">
                        <label>Estado</label>
                        <p>
                            <span className={`status-badge status-${log.estado?.toLowerCase()}`}>
                                {log.estado}
                            </span>
                        </p>
                    </div>
                    <div className="auditoria-detail-block">
                        <label>Fecha</label>
                        <p>{formatearFecha(log.timestamp)}</p>
                    </div>
                    {log.ipAddress && (
                        <div className="auditoria-detail-block">
                            <label>IP Address</label>
                            <p>{log.ipAddress}</p>
                        </div>
                    )}
                </div>

                <div className="auditoria-detail-description">
                    <label>Descripción</label>
                    <p>{log.descripcion}</p>
                </div>

                <div className="detail-changes detail-changes-v2">
                    <div className="changes-section changes-before">
                        <h3>Valores anteriores</h3>
                        {renderJson(log.detallesAntes)}
                    </div>

                    <div className="changes-section changes-after">
                        <h3>Valores nuevos</h3>
                        {renderJson(log.detallesDespues)}
                    </div>
                </div>

                <div className="detail-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AuditoriaDetail;
