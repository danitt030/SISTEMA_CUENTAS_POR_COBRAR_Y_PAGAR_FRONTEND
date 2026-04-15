import React, { useState } from "react";

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
    return condicion === "CONTADO" ? "bg-green-600" : "bg-orange-600";
  };

  const getCondicionLabel = (condicion) => {
    return condicion === "CONTADO" ? "Contado" : "Crédito";
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-400">Cargando clientes...</div>;
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <p className="text-gray-600 dark:text-gray-400">No hay clientes registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <th className="px-4 py-3 text-left text-sm font-bold text-white">
                <button className="text-white">+</button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Documento</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Correo</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Teléfono</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Pago</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Límite Crédito</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">Estado</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <React.Fragment key={cliente.id}>
                <tr className={`border-b border-gray-200 dark:border-gray-700 ${!cliente.estado ? "opacity-60 bg-gray-50 dark:bg-gray-800/50" : ""}`}>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="text-gray-600 dark:text-gray-400"
                      onClick={() => setClienteExpandido(clienteExpandido === cliente.id ? null : cliente.id)}
                    >
                      {clienteExpandido === cliente.id ? "▼" : "▶"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-white">{cliente.nombre}</td>
                  <td className="px-4 py-3 text-sm text-white">{cliente.tipoDocumento}: {cliente.numeroDocumento}</td>
                  <td className="px-4 py-3 text-sm text-white">{cliente.correo}</td>
                  <td className="px-4 py-3 text-sm text-white">{cliente.telefono}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${getCondicionColor(cliente.condicionPago)}`}>
                      {getCondicionLabel(cliente.condicionPago)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {cliente.limiteCreditoMes > 0 ? `Q${cliente.limiteCreditoMes.toLocaleString()}` : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${cliente.estado ? "bg-green-600" : "bg-red-600"}`}>
                      {cliente.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2 flex-wrap">
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
                </tr>
                {clienteExpandido === cliente.id && (
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <td colSpan="9" className="px-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <strong className="text-gray-900 dark:text-white">Contacto:</strong>
                          <p className="text-gray-600 dark:text-gray-400">{cliente.nombreContacto || "-"}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <strong className="text-gray-900 dark:text-white">Tel. Contacto:</strong>
                          <p className="text-gray-600 dark:text-gray-400">{cliente.telefonoContacto || "-"}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <strong className="text-gray-900 dark:text-white">Email:</strong>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{cliente.correoContacto || "-"}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <strong className="text-gray-900 dark:text-white">NIT:</strong>
                          <p className="text-gray-600 dark:text-gray-400">{cliente.nit || "-"}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <strong className="text-gray-900 dark:text-white">Tel. Secundario:</strong>
                          <p className="text-gray-600 dark:text-gray-400">{cliente.telefonoSecundario || "-"}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <strong className="text-gray-900 dark:text-white">Dirección:</strong>
                          <p className="text-gray-600 dark:text-gray-400">{cliente.direccion || "-"}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <strong className="text-gray-900 dark:text-white">Ciudad:</strong>
                          <p className="text-gray-600 dark:text-gray-400">{cliente.ciudad || "-"}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <strong className="text-gray-900 dark:text-white">Departamento:</strong>
                          <p className="text-gray-600 dark:text-gray-400">{cliente.departamento || "-"}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <strong className="text-gray-900 dark:text-white">Código Postal:</strong>
                          <p className="text-gray-600 dark:text-gray-400">{cliente.codigoPostal || "-"}</p>
                        </div>
                        {cliente.condicionPago === "CREDITO" && (
                          <div className="bg-white dark:bg-gray-800 rounded p-3">
                            <strong className="text-gray-900 dark:text-white">Días de Crédito:</strong>
                            <p className="text-gray-600 dark:text-gray-400">{cliente.diasCredito || "0"}</p>
                          </div>
                        )}
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <strong className="text-gray-900 dark:text-white">Banco:</strong>
                          <p className="text-gray-600 dark:text-gray-400">{cliente.banco || "-"}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <strong className="text-gray-900 dark:text-white">No. Cuenta:</strong>
                          <p className="text-gray-600 dark:text-gray-400">{cliente.numeroCuenta || "-"}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <strong className="text-gray-900 dark:text-white">Tipo Cuenta:</strong>
                          <p className="text-gray-600 dark:text-gray-400">{cliente.tipoCuenta || "-"}</p>
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

      {/* Animaciones Destructivas */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        @keyframes spinOut {
          0% { transform: rotate(0deg) scale(1); opacity: 1; }
          70% { transform: rotate(10deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(0.5); opacity: 0; }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out 2;
        }
        .animate-spinOut {
          animation: spinOut 0.6s ease-in-out 1;
        }
      `}</style>
    </div>
  );
};
