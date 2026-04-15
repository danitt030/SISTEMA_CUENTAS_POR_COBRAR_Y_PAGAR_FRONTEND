const ModuloBadge = ({ modulo }) => {
    const clases = {
        USUARIOS: "violet",
        PROVEEDORES: "amber",
        CLIENTES: "green",
        FACTURAS_PAGAR: "red",
        FACTURAS_COBRAR: "cyan",
        PAGOS_PROVEEDORES: "gold",
        COBROS_CLIENTES: "blue",
        REPORTES: "slate",
        AUDITORIA: "neutral"
    };

    return (
        <span className={`auditoria-chip modulo-chip ${clases[modulo] || "neutral"}`}>
            {modulo}
        </span>
    );
};

export default ModuloBadge;
