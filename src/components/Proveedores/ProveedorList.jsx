import React, { useState } from "react";

export const ProveedorList = ({
  proveedores = [],
  loading = false,
  onEdit = null,
  onDelete = null,
  onVerSaldo = null,
  onEliminarPermanente = null,
}) => {
  const [proveedorExpandido, setProveedorExpandido] = useState(null);

  const getCondicionColor = (condicion) => {
    return condicion === "CONTADO" ? "#28a745" : "#fd7e14";
  };

  const getCondicionLabel = (condicion) => {
    return condicion === "CONTADO" ? "Contado" : "Crédito";
  };

  if (loading) {
    return <div className="loading">Cargando proveedores...</div>;
  }

  if (!proveedores || proveedores.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay proveedores registrados</p>
      </div>
    );
  }

  return (
    <div className="proveedores-list">
      <table className="proveedores-table">
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Condición Pago</th>
            <th>Límite Crédito</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <React.Fragment key={proveedor.id}>
              <tr className={!proveedor.estado ? "inactivo" : ""}>
                <td className="expand-cell">
                  <button
                    className="expand-btn"
                    onClick={() => setProveedorExpandido(proveedorExpandido === proveedor.id ? null : proveedor.id)}
                  >
                    {proveedorExpandido === proveedor.id ? "▼" : "▶"}
                  </button>
                </td>
                <td>
                  <strong>{proveedor.nombre}</strong>
                </td>
                <td>
                  {proveedor.tipoDocumento}: {proveedor.numeroDocumento}
                </td>
                <td>{proveedor.correo}</td>
                <td>{proveedor.telefono}</td>
                <td>
                  <span
                    className="condicion-badge"
                    style={{
                      backgroundColor: getCondicionColor(proveedor.condicionPago),
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {getCondicionLabel(proveedor.condicionPago)}
                  </span>
                </td>
                <td>
                  {proveedor.limiteCreditoMes > 0
                    ? `Q${proveedor.limiteCreditoMes.toLocaleString()}`
                    : "-"}
                </td>
                <td>
                  <span className={`estado-badge ${proveedor.estado ? "activo" : "inactivo"}`}>
                    {proveedor.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <div className="acciones">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(proveedor)}
                        className="action-btn action-btn-edit"
                        title="Editar"
                      >
                        Editar
                      </button>
                    )}

                    {onVerSaldo && (
                      <button
                        onClick={() => onVerSaldo(proveedor)}
                        className="action-btn action-btn-success"
                        title="Ver Saldo"
                      >
                        Saldo
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={() => onDelete(proveedor)}
                        className="action-btn action-btn-danger"
                        title="Desactivar"
                        disabled={!proveedor.estado}
                      >
                        Desactivar
                      </button>
                    )}

                    {onEliminarPermanente && (
                      <button
                        onClick={() => onEliminarPermanente(proveedor)}
                        className="action-btn action-btn-dark"
                        title="Eliminar Permanentemente"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {proveedorExpandido === proveedor.id && (
                <tr className="expandible-row">
                  <td colSpan="9">
                    <div className="proveedor-detalles">
                      <div className="detalles-grid">
                        <div className="detalle-item">
                          <strong>Contacto:</strong> {proveedor.nombreContacto || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Tel. Contacto:</strong> {proveedor.telefonoContacto || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Email Contacto:</strong> {proveedor.correoContacto || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>NIT:</strong> {proveedor.nit || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Tel. Secundario:</strong> {proveedor.telefonoSecundario || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Dirección:</strong> {proveedor.direccion || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Ciudad:</strong> {proveedor.ciudad || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Departamento:</strong> {proveedor.departamento || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Código Postal:</strong> {proveedor.codigoPostal || "-"}
                        </div>
                        {proveedor.condicionPago === "CREDITO" && (
                          <>
                            <div className="detalle-item">
                              <strong>Días de Crédito:</strong> {proveedor.diasCredito || "0"}
                            </div>
                          </>
                        )}
                        <div className="detalle-item">
                          <strong>Banco:</strong> {proveedor.banco || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>No. Cuenta:</strong> {proveedor.numeroCuenta || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Tipo Cuenta:</strong> {proveedor.tipoCuenta || "-"}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
