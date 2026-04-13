const ActionBadge = ({ accion }) => {
    const estilos = {
        CREAR: {
            bg: "#d4edda",
            color: "#155724",
            border: "1px solid #c3e6cb"
        },
        ACTUALIZAR: {
            bg: "#cfe2ff",
            color: "#084298",
            border: "1px solid #b6d4fe"
        },
        ELIMINAR: {
            bg: "#f8d7da",
            color: "#842029",
            border: "1px solid #f5c2c7"
        },
        LEER: {
            bg: "#e7d4f5",
            color: "#545454",
            border: "1px solid #d3c9e3"
        },
        EXPORTAR: {
            bg: "#fff3cd",
            color: "#664d03",
            border: "1px solid #ffecb5"
        },
        DESCARGAR: {
            bg: "#d1ecf1",
            color: "#0c5460",
            border: "1px solid #bee5eb"
        },
        LOGIN: {
            bg: "#d4edda",
            color: "#155724",
            border: "1px solid #c3e6cb"
        },
        LOGOUT: {
            bg: "#f8d7da",
            color: "#842029",
            border: "1px solid #f5c2c7"
        }
    };

    const estilo = estilos[accion] || {
        bg: "#e2e3e5",
        color: "#383d41",
        border: "1px solid #d3d6d8"
    };

    return (
        <span
            style={{
                display: "inline-block",
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: estilo.bg,
                color: estilo.color,
                border: estilo.border,
                fontSize: "12px",
                fontWeight: "500"
            }}
        >
            {accion}
        </span>
    );
};

export default ActionBadge;
