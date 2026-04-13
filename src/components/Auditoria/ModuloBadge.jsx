const ModuloBadge = ({ modulo }) => {
    const estilos = {
        USUARIOS: { bg: "#dcccff", color: "#5a21b5" },
        PROVEEDORES: { bg: "#fce7d2", color: "#b45309" },
        CLIENTES: { bg: "#d4edda", color: "#155724" },
        FACTURAS_PAGAR: { bg: "#f8d7da", color: "#842029" },
        FACTURAS_COBRAR: { bg: "#d1ecf1", color: "#0c5460" },
        PAGOS_PROVEEDORES: { bg: "#fff3cd", color: "#664d03" },
        COBROS_CLIENTES: { bg: "#cfe2ff", color: "#084298" },
        REPORTES: { bg: "#e7d4f5", color: "#545454" },
        AUDITORIA: { bg: "#e2e3e5", color: "#383d41" }
    };

    const estilo = estilos[modulo] || {
        bg: "#e2e3e5",
        color: "#383d41"
    };

    return (
        <span
            style={{
                display: "inline-block",
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: estilo.bg,
                color: estilo.color,
                fontSize: "12px",
                fontWeight: "500"
            }}
        >
            {modulo}
        </span>
    );
};

export default ModuloBadge;
