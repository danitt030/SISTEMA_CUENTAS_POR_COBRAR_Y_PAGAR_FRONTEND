import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const MotionDiv = motion.div;
const MotionRow = motion.tr;

export const ProveedorList = ({
  proveedores = [],
  loading = false,
  onEdit = null,
  onDelete = null,
  onVerSaldo = null,
  onEliminarPermanente = null,
}) => {
  const reduceMotion = useReducedMotion();
  const [proveedorExpandido, setProveedorExpandido] = useState(null);

  const getCondicionLabel = (condicion) => {
    return condicion === "CONTADO" ? "Contado" : "Crédito";
  };

  const getCondicionClass = (condicion) => {
    return condicion === "CONTADO" ? "usuario-role-gerente" : "usuario-role-gerencia";
  };

  if (loading) {
    return <div className="usuarios-empty-state">Cargando proveedores...</div>;
  }

  if (!proveedores || proveedores.length === 0) {
    return <div className="usuarios-empty-state">No hay proveedores registrados</div>;
  }

  return (
    <MotionDiv
      className="usuarios-table-shell"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="overflow-x-auto">
      <table className="usuarios-table">
        <thead className="usuarios-table-head">
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Condición Pago</th>
            <th>Límite Crédito</th>
            <th>Estado</th>
            <th className="usuarios-actions-col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor, index) => {
            const proveedorId = proveedor.id || proveedor._id;

            return (
            <React.Fragment key={proveedorId}>
              <MotionRow
                className={`usuarios-row ${!proveedor.estado ? "usuarios-row-disabled" : ""}`}
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
                    onClick={() => setProveedorExpandido(proveedorExpandido === proveedorId ? null : proveedorId)}
                  >
                    {proveedorExpandido === proveedorId ? "▼" : "▶"}
                  </button>
                </td>
                <td className="usuarios-cell usuario-name">
                  <strong>{proveedor.nombre}</strong>
                </td>
                <td className="usuarios-cell">
                  {proveedor.tipoDocumento}: {proveedor.numeroDocumento}
                </td>
                <td className="usuarios-cell usuario-mail">{proveedor.correo}</td>
                <td className="usuarios-cell usuario-mail">{proveedor.telefono}</td>
                <td className="usuarios-cell">
                  <span
                    className={`usuario-role-chip ${getCondicionClass(proveedor.condicionPago)}`}
                  >
                    {getCondicionLabel(proveedor.condicionPago)}
                  </span>
                </td>
                <td className="usuarios-cell usuario-mail">
                  {proveedor.limiteCreditoMes > 0
                    ? `Q${proveedor.limiteCreditoMes.toLocaleString()}`
                    : "-"}
                </td>
                <td className="usuarios-cell">
                  <span className={`usuario-status-chip ${proveedor.estado ? "usuario-status-active" : "usuario-status-inactive"}`}>
                    {proveedor.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="usuarios-cell usuarios-actions-col">
                  <div className="usuarios-actions">
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
              </MotionRow>
              {proveedorExpandido === proveedorId && (
                <tr className="usuarios-row-disabled">
                  <td colSpan="9" className="usuarios-cell">
                    <div className="detail-info">
                        <article className="detail-item">
                          <p className="detail-label">Contacto</p>
                          <p className="detail-value">{proveedor.nombreContacto || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">Tel. Contacto</p>
                          <p className="detail-value">{proveedor.telefonoContacto || "-"}</p>
                        </article>
                        <article className="detail-item detail-item-wide">
                          <p className="detail-label">Email Contacto</p>
                          <p className="detail-value">{proveedor.correoContacto || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">NIT</p>
                          <p className="detail-value">{proveedor.nit || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">Tel. Secundario</p>
                          <p className="detail-value">{proveedor.telefonoSecundario || "-"}</p>
                        </article>
                        <article className="detail-item detail-item-wide">
                          <p className="detail-label">Dirección</p>
                          <p className="detail-value">{proveedor.direccion || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">Ciudad</p>
                          <p className="detail-value">{proveedor.ciudad || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">Departamento</p>
                          <p className="detail-value">{proveedor.departamento || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">Código Postal</p>
                          <p className="detail-value">{proveedor.codigoPostal || "-"}</p>
                        </article>
                        {proveedor.condicionPago === "CREDITO" && (
                          <article className="detail-item">
                            <p className="detail-label">Días de Crédito</p>
                            <p className="detail-value">{proveedor.diasCredito || "0"}</p>
                          </article>
                        )}
                        <article className="detail-item">
                          <p className="detail-label">Banco</p>
                          <p className="detail-value">{proveedor.banco || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">No. Cuenta</p>
                          <p className="detail-value">{proveedor.numeroCuenta || "-"}</p>
                        </article>
                        <article className="detail-item">
                          <p className="detail-label">Tipo Cuenta</p>
                          <p className="detail-value">{proveedor.tipoCuenta || "-"}</p>
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
