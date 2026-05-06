import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const MotionDiv = motion.div;
const MotionRow = motion.tr;

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
  const reduceMotion = useReducedMotion();
  const [clienteExpandido, setClienteExpandido] = useState(null);

  const getCondicionLabel = (condicion) => {
    return condicion === "CONTADO" ? "Contado" : "Crédito";
  };

  const getCondicionClass = (condicion) => {
    return condicion === "CONTADO" ? "usuario-role-gerente" : "usuario-role-gerencia";
  };

  if (loading) {
    return <div className="usuarios-empty-state">Cargando clientes...</div>;
  }

  if (!clientes || clientes.length === 0) {
    return <div className="usuarios-empty-state">No hay clientes registrados</div>;
  }

  return (
    <MotionDiv
      className="usuarios-table-shell"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="overflow-x-auto">
        <table className="w-full usuarios-table">
          <thead className="usuarios-table-head">
            <tr>
              <th>
                <button className="text-white">+</button>
              </th>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Pago</th>
              <th>Límite Crédito</th>
              <th>Estado</th>
              <th className="usuarios-actions-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente, index) => {
              const clienteId = cliente.id || cliente._id;

              return (
              <React.Fragment key={clienteId}>
                <MotionRow
                  className={`usuarios-row ${!cliente.estado ? "usuarios-row-disabled" : ""}`}
                  initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.18,
                    delay: reduceMotion ? 0 : Math.min(index * 0.02, 0.18),
                  }}
                >
                  <td className="usuarios-cell text-center">
                    <button
                      className="text-slate-500"
                      onClick={() => setClienteExpandido(clienteExpandido === clienteId ? null : clienteId)}
                    >
                      {clienteExpandido === clienteId ? "▼" : "▶"}
                    </button>
                  </td>
                  <td className="usuarios-cell usuario-name">{cliente.nombre}</td>
                  <td className="usuarios-cell">{cliente.tipoDocumento}: {cliente.numeroDocumento}</td>
                  <td className="usuarios-cell usuario-mail">{cliente.correo}</td>
                  <td className="usuarios-cell usuario-mail">{cliente.telefono}</td>
                  <td className="usuarios-cell">
                    <span className={`usuario-role-chip ${getCondicionClass(cliente.condicionPago)}`}>
                      {getCondicionLabel(cliente.condicionPago)}
                    </span>
                  </td>
                  <td className="usuarios-cell usuario-mail">
                    {cliente.limiteCreditoMes > 0 ? `Q${cliente.limiteCreditoMes.toLocaleString()}` : "-"}
                  </td>
                  <td className="usuarios-cell">
                    <span className={`usuario-status-chip ${cliente.estado ? "usuario-status-active" : "usuario-status-inactive"}`}>
                      {cliente.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="usuarios-cell usuarios-actions-col">
                    <div className="usuarios-actions">
                      {onEdit && permisos?.puedeEditar && (
                        <button 
                          onClick={() => onEdit(cliente)}
                          className="action-btn action-btn-edit" 
                          title="Editar"
                        >
                          Editar
                        </button>
                      )}
                      {onVerSaldo && (
                        <button 
                          onClick={() => onVerSaldo(cliente)}
                          className="action-btn action-btn-success" 
                          title="Ver Saldo"
                        >
                          Saldo
                        </button>
                      )}
                      {onVerificaCredito && (
                        <button 
                          onClick={() => onVerificaCredito(cliente)}
                          className="action-btn action-btn-warning" 
                          title="Verificar Crédito"
                        >
                          Credito
                        </button>
                      )}
                      {onDelete && permisos?.puedeDesactivar && (
                        <button
                          onClick={() => onDelete(cliente)}
                          className="action-btn action-btn-danger"
                          title="Desactivar"
                          disabled={!cliente.estado}
                        >
                          Desactivar
                        </button>
                      )}
                      {onEliminarPermanente && permisos?.puedeEliminar && (
                        <button
                          onClick={() => onEliminarPermanente(cliente)}
                          className="action-btn action-btn-dark"
                          title="Eliminar Permanentemente"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </MotionRow>
                {clienteExpandido === clienteId && (
                  <tr className="usuarios-row-disabled">
                    <td colSpan="9" className="usuarios-cell">
                      <div className="detail-info">
                        <article className="detail-item">
                          <p className="detail-label">Contacto</p>
                          <p className="detail-value">{cliente.nombreContacto || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">Tel. Contacto</p>
                          <p className="detail-value">{cliente.telefonoContacto || "-"}</p>
                        </article>
                        <article className="detail-item detail-item-wide">
                          <p className="detail-label">Email</p>
                          <p className="detail-value">{cliente.correoContacto || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">NIT</p>
                          <p className="detail-value">{cliente.nit || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">Tel. Secundario</p>
                          <p className="detail-value">{cliente.telefonoSecundario || "-"}</p>
                        </article>
                        <article className="detail-item detail-item-wide">
                          <p className="detail-label">Dirección</p>
                          <p className="detail-value">{cliente.direccion || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">Ciudad</p>
                          <p className="detail-value">{cliente.ciudad || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">Departamento</p>
                          <p className="detail-value">{cliente.departamento || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">Código Postal</p>
                          <p className="detail-value">{cliente.codigoPostal || "-"}</p>
                        </article>
                        {cliente.condicionPago === "CREDITO" && (
                          <article className="detail-item">
                            <p className="detail-label">Días de Crédito</p>
                            <p className="detail-value">{cliente.diasCredito || "0"}</p>
                          </article>
                        )}
                        <article className="detail-item">
                          <p className="detail-label">Banco</p>
                          <p className="detail-value">{cliente.banco || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">No. Cuenta</p>
                          <p className="detail-value">{cliente.numeroCuenta || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">Tipo Cuenta</p>
                          <p className="detail-value">{cliente.tipoCuenta || "-"}</p>
                        </article>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );})}
          </tbody>
        </table>
      </div>
    </MotionDiv>
  );
};
