const ActionBadge = ({ accion }) => {
    const clases = {
        CREAR: "ok",
        ACTUALIZAR: "info",
        ELIMINAR: "danger",
        LEER: "neutral",
        EXPORTAR: "warning",
        DESCARGAR: "sky",
        LOGIN: "ok",
        LOGOUT: "danger"
    };

    return (
        <span className={`auditoria-chip accion-chip ${clases[accion] || "neutral"}`}>
            {accion}
        </span>
    );
};

export default ActionBadge;
