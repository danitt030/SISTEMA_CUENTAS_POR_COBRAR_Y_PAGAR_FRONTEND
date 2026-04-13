import React, { useState } from "react";
import "./clienteList.css";

export const ClienteList = ({
  clientes = [],
  loading = false,
  permisos = {},
  onEdit = null,
  onDelete = null,
  onVerSaldo = null,
  onVerificaCredito = null,
  onEliminarPermanente = null,
}) => {
  const [clienteExpandido, setClienteExpandido] = useState(null);

  const getCondicionColor = (condicion) => {
    return condicion === "CONTADO" ? "#28a745" : "#fd7e14";
  };

  const getCondicionLabel = (condicion) => {
    return condicion === "CONTADO" ? "Contado" : "Crédito";
  };

  if (loading) {
    return <div className="loading">Cargando clientes...</div>;
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay clientes registrados</p>
      </div>
    );
  }

  return (
    <div className="clientes-list">
      <table className="clientes-table">
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
          {clientes.map((cliente) => (
            <React.Fragment key={cliente.id}>
              <tr className={!cliente.estado ? "inactivo" : ""}>
                <td className="expand-cell">
                  <button
                    className="expand-btn"
                    onClick={() => setClienteExpandido(clienteExpandido === cliente.id ? null : cliente.id)}
                  >
                    {clienteExpandido === cliente.id ? "▼" : "▶"}
                  </button>
                </td>
                <td>
                  <strong>{cliente.nombre}</strong>
                </td>
                <td>
                  {cliente.tipoDocumento}: {cliente.numeroDocumento}
                </td>
                <td>{cliente.correo}</td>
                <td>{cliente.telefono}</td>
                <td>
                  <span
                    className="condicion-badge"
                    style={{
                      backgroundColor: getCondicionColor(cliente.condicionPago),
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {getCondicionLabel(cliente.condicionPago)}
                  </span>
                </td>
                <td>
                  {cliente.limiteCreditoMes > 0
                    ? `Q${cliente.limiteCreditoMes.toLocaleString()}`
                    : "-"}
                </td>
                <td>
                  <span className={`estado-badge ${cliente.estado ? "activo" : "inactivo"}`}>
                    {cliente.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <div className="acciones">
                    {onEdit && permisos?.puedeEditar && (
                      <button
                        onClick={() => onEdit(cliente)}
                        className="btn btn-sm btn-info"
                        title="Editar"
                      >
                        ✏️
                      </button>
                    )}

                    {onVerSaldo && (
                      <button
                        onClick={() => onVerSaldo(cliente)}
                        className="btn btn-sm btn-success"
                        title="Ver Saldo"
                      >
                        💰
                      </button>
                    )}

                    {onVerificaCredito && (
                      <button
                        onClick={() => onVerificaCredito(cliente)}
                        className="btn btn-sm btn-warning"
                        title="Verificar Crédito"
                      >
                        💳
                      </button>
                    )}

                    {onDelete && permisos?.puedeDesactivar && (
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Desactivar cliente ${cliente.nombre}?`)) {
                            onDelete(cliente.id);
                          }
                        }}
                        className="btn btn-sm btn-danger"
                        title="Desactivar"
                        disabled={!cliente.estado}
                      >
                        🗑️
                      </button>
                    )}

                    {onEliminarPermanente && permisos?.puedeEliminar && (
                      <button
                        onClick={() => {
                          if (window.confirm(`⚠️ ¿ELIMINAR PERMANENTEMENTE ${cliente.nombre}? Esta acción no se puede deshacer.`)) {
                            onEliminarPermanente(cliente.id);
                          }
                        }}
                        className="btn btn-sm btn-dark"
                        title="Eliminar Permanentemente"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {clienteExpandido === cliente.id && (
                <tr className="expandible-row">
                  <td colSpan="9">
                    <div className="cliente-detalles">
                      <div className="detalles-grid">
                        <div className="detalle-item">
                          <strong>Contacto:</strong> {cliente.nombreContacto || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Tel. Contacto:</strong> {cliente.telefonoContacto || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Email Contacto:</strong> {cliente.correoContacto || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>NIT:</strong> {cliente.nit || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Tel. Secundario:</strong> {cliente.telefonoSecundario || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Dirección:</strong> {cliente.direccion || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Ciudad:</strong> {cliente.ciudad || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Departamento:</strong> {cliente.departamento || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Código Postal:</strong> {cliente.codigoPostal || "-"}
                        </div>
                        {cliente.condicionPago === "CREDITO" && (
                          <>
                            <div className="detalle-item">
                              <strong>Días de Crédito:</strong> {cliente.diasCredito || "0"}
                            </div>
                          </>
                        )}
                        <div className="detalle-item">
                          <strong>Banco:</strong> {cliente.banco || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>No. Cuenta:</strong> {cliente.numeroCuenta || "-"}
                        </div>
                        <div className="detalle-item">
                          <strong>Tipo Cuenta:</strong> {cliente.tipoCuenta || "-"}
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
