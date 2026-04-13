import { useState, useEffect, useCallback } from "react";
import { useClientes } from "../../shared/hooks/useClientes";
import toast from "react-hot-toast";
import "./clientePortal.css";

export const ClientePortal = () => {
  const {
    loading,
    obtenerMiPerfilFunc,
    obtenerMisFacturasFunc,
    obtenerDetalleFacturaFunc,
    obtenerMisCobrosFunc,
    obtenerMiSaldoFunc,
    obtenerMisFacturasVencidasFunc,
  } = useClientes();

  const [miPerfil, setMiPerfil] = useState(null);
  const [misFacturas, setMisFacturas] = useState([]);
  const [misCobros, setMisCobros] = useState([]);
  const [miSaldo, setMiSaldo] = useState(null);
  const [misFacturasVencidas, setMisFacturasVencidas] = useState([]);
  const [pestaña, setPestaña] = useState("perfil"); // perfil, facturas, cobros, saldo, vencidas
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      // Cargar perfil
      const resultadoPerfil = await obtenerMiPerfilFunc();
      if (!resultadoPerfil.error) {
        setMiPerfil(resultadoPerfil.data);
      } else {
        toast.error("Error al cargar tu perfil");
      }

      // Cargar mis facturas
      const resultadoFacturas = await obtenerMisFacturasFunc(100, 0);
      if (!resultadoFacturas.error) {
        setMisFacturas(resultadoFacturas.data);
      }

      // Cargar mis cobros
      const resultadoCobros = await obtenerMisCobrosFunc(100, 0);
      if (!resultadoCobros.error) {
        setMisCobros(resultadoCobros.data);
      }

      // Cargar mi saldo
      const resultadoSaldo = await obtenerMiSaldoFunc();
      if (!resultadoSaldo.error) {
        setMiSaldo(resultadoSaldo.data);
      }

      // Cargar mis facturas vencidas
      const resultadoVencidas = await obtenerMisFacturasVencidasFunc(100, 0);
      if (!resultadoVencidas.error) {
        setMisFacturasVencidas(resultadoVencidas.data);
      }
    };

    cargarDatos();
  }, [obtenerMiPerfilFunc, obtenerMisFacturasFunc, obtenerMisCobrosFunc, obtenerMiSaldoFunc, obtenerMisFacturasVencidasFunc]);

  const handleVerDetalleFactura = async (facturaId) => {
    const resultado = await obtenerDetalleFacturaFunc(facturaId);
    if (!resultado.error) {
      setFacturaSeleccionada(resultado.data);
      setModalDetalleVisible(true);
    } else {
      toast.error("Error al obtener detalle de factura");
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      "PAGADA": "#28a745",
      "PARCIAL": "#ffc107",
      "PENDIENTE": "#dc3545",
      "VENCIDA": "#721c24",
    };
    return colores[estado] || "#6c757d";
  };

  if (loading) {
    return <div className="loading">Cargando tu información...</div>;
  }

  return (
    <div className="cliente-portal-container">
      <div className="portal-header">
        <h2>🏠 Mi Portal de Cliente</h2>
        {miPerfil && <p className="bienvenida">Bienvenido, {miPerfil.nombre}</p>}
      </div>

      {/* NAVEGACIÓN DE PESTAÑAS */}
      <div className="portal-tabs">
        <button
          className={`tab-btn ${pestaña === "perfil" ? "active" : ""}`}
          onClick={() => setPestaña("perfil")}
        >
          👤 Mi Perfil
        </button>
        <button
          className={`tab-btn ${pestaña === "saldo" ? "active" : ""}`}
          onClick={() => setPestaña("saldo")}
        >
          💰 Mi Saldo
        </button>
        <button
          className={`tab-btn ${pestaña === "facturas" ? "active" : ""}`}
          onClick={() => setPestaña("facturas")}
        >
          📄 Mis Facturas ({misFacturas.length})
        </button>
        <button
          className={`tab-btn ${pestaña === "cobros" ? "active" : ""}`}
          onClick={() => setPestaña("cobros")}
        >
          ✅ Mis Cobros ({misCobros.length})
        </button>
        <button
          className={`tab-btn ${pestaña === "vencidas" ? "active" : ""}`}
          onClick={() => setPestaña("vencidas")}
        >
          ⚠️ Facturas Vencidas ({misFacturasVencidas.length})
        </button>
      </div>

      {/* CONTENIDO DE PESTAÑAS */}

      {/* MI PERFIL */}
      {pestaña === "perfil" && miPerfil && (
        <div className="tab-content">
          <div className="perfil-card">
            <h3>Información de tu Cuenta</h3>
            <div className="perfil-grid">
              <div className="perfil-item">
                <label>Nombre Empresa:</label>
                <p>{miPerfil.nombre}</p>
              </div>
              <div className="perfil-item">
                <label>Contacto:</label>
                <p>{miPerfil.nombreContacto || "-"}</p>
              </div>
              <div className="perfil-item">
                <label>Email:</label>
                <p>{miPerfil.correo}</p>
              </div>
              <div className="perfil-item">
                <label>Teléfono:</label>
                <p>{miPerfil.telefono}</p>
              </div>
              <div className="perfil-item">
                <label>Teléfono Contacto:</label>
                <p>{miPerfil.telefonoContacto || "-"}</p>
              </div>
              <div className="perfil-item">
                <label>Email Contacto:</label>
                <p>{miPerfil.correoContacto || "-"}</p>
              </div>
              <div className="perfil-item">
                <label>Tipo Documento:</label>
                <p>{miPerfil.tipoDocumento}</p>
              </div>
              <div className="perfil-item">
                <label>Número Documento:</label>
                <p>{miPerfil.numeroDocumento}</p>
              </div>
              <div className="perfil-item">
                <label>NIT:</label>
                <p>{miPerfil.nit || "-"}</p>
              </div>
              <div className="perfil-item">
                <label>Dirección:</label>
                <p>{miPerfil.direccion}</p>
              </div>
              <div className="perfil-item">
                <label>Ciudad:</label>
                <p>{miPerfil.ciudad}</p>
              </div>
              <div className="perfil-item">
                <label>Departamento:</label>
                <p>{miPerfil.departamento}</p>
              </div>
              <div className="perfil-item">
                <label>Condición de Pago:</label>
                <p>{miPerfil.condicionPago}</p>
              </div>
              {miPerfil.condicionPago === "CREDITO" && (
                <>
                  <div className="perfil-item">
                    <label>Días de Crédito:</label>
                    <p>{miPerfil.diasCredito}</p>
                  </div>
                  <div className="perfil-item">
                    <label>Límite de Crédito Mensual:</label>
                    <p>Q{miPerfil.limiteCreditoMes?.toLocaleString() || "0"}</p>
                  </div>
                </>
              )}
              <div className="perfil-item">
                <label>Banco:</label>
                <p>{miPerfil.banco || "-"}</p>
              </div>
              <div className="perfil-item">
                <label>Número de Cuenta:</label>
                <p>{miPerfil.numeroCuenta || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MI SALDO */}
      {pestaña === "saldo" && miSaldo && (
        <div className="tab-content">
          <div className="saldo-card">
            <h3>Resumen de tu Saldo</h3>
            <div className="saldo-grid">
              <div className="saldo-item">
                <label>Saldo Pendiente:</label>
                <p className="monto-pendiente">Q{miSaldo.saldoPendiente?.toLocaleString() || "0"}</p>
              </div>
              <div className="saldo-item">
                <label>Total Facturas:</label>
                <p className="monto-total">Q{miSaldo.totalFacturas?.toLocaleString() || "0"}</p>
              </div>
              <div className="saldo-item">
                <label>Total Pagado:</label>
                <p className="monto-pagado">Q{miSaldo.totalPagado?.toLocaleString() || "0"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MIS FACTURAS */}
      {pestaña === "facturas" && (
        <div className="tab-content">
          <h3>Mis Facturas</h3>
          {misFacturas.length === 0 ? (
            <p className="empty-message">No tienes facturas registradas</p>
          ) : (
            <div className="facturas-list">
              <table>
                <thead>
                  <tr>
                    <th>Número Factura</th>
                    <th>Monto</th>
                    <th>Moneda</th>
                    <th>Estado</th>
                    <th>Fecha Emisión</th>
                    <th>Fecha Vencimiento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {misFacturas.map((factura) => (
                    <tr key={factura.id || factura._id}>
                      <td>{factura.numeroFactura}</td>
                      <td>Q{factura.monto?.toLocaleString() || "0"}</td>
                      <td>{factura.moneda}</td>
                      <td>
                        <span
                          className="estado-badge"
                          style={{ backgroundColor: getEstadoColor(factura.estado), color: "#fff" }}
                        >
                          {factura.estado}
                        </span>
                      </td>
                      <td>{new Date(factura.fechaEmision).toLocaleDateString()}</td>
                      <td>{new Date(factura.fechaVencimiento).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleVerDetalleFactura(factura.id || factura._id)}
                          className="btn btn-sm btn-info"
                          title="Ver Detalle"
                        >
                          👁️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MIS COBROS */}
      {pestaña === "cobros" && (
        <div className="tab-content">
          <h3>Mis Cobros Registrados</h3>
          {misCobros.length === 0 ? (
            <p className="empty-message">No tienes cobros registrados</p>
          ) : (
            <div className="cobros-list">
              <table>
                <thead>
                  <tr>
                    <th>Número de Cobro</th>
                    <th>Factura</th>
                    <th>Monto</th>
                    <th>Fecha de Cobro</th>
                    <th>Forma de Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {misCobros.map((cobro) => (
                    <tr key={cobro.id || cobro._id}>
                      <td>{cobro.numeroCobro}</td>
                      <td>{cobro.factura?.numeroFactura || "-"}</td>
                      <td>Q{cobro.monto?.toLocaleString() || "0"}</td>
                      <td>{new Date(cobro.fechaCobro).toLocaleDateString()}</td>
                      <td>{cobro.formaPago}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* FACTURAS VENCIDAS */}
      {pestaña === "vencidas" && (
        <div className="tab-content">
          <h3>⚠️ Mis Facturas Vencidas</h3>
          {misFacturasVencidas.length === 0 ? (
            <p className="empty-message" style={{ color: "#28a745" }}>
              ✅ ¡No tienes facturas vencidas! Todo está al día.
            </p>
          ) : (
            <div className="facturas-vencidas-list">
              <table>
                <thead>
                  <tr>
                    <th>Número Factura</th>
                    <th>Monto</th>
                    <th>Fecha Vencimiento</th>
                    <th>Días Vencida</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {misFacturasVencidas.map((factura) => {
                    const fechaVencimiento = new Date(factura.fechaVencimiento);
                    const hoy = new Date();
                    const diasVencida = Math.floor(
                      (hoy - fechaVencimiento) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <tr key={factura.id || factura._id} className="fila-vencida">
                        <td>{factura.numeroFactura}</td>
                        <td>Q{factura.monto?.toLocaleString() || "0"}</td>
                        <td>{fechaVencimiento.toLocaleDateString()}</td>
                        <td>
                          <span className="dias-vencida">
                            {diasVencida} días
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleVerDetalleFactura(factura.id || factura._id)}
                            className="btn btn-sm btn-warning"
                            title="Ver Detalle"
                          >
                            👁️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL DETALLE FACTURA */}
      {modalDetalleVisible && facturaSeleccionada && (
        <div className="modal-overlay" onClick={() => setModalDetalleVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalle de Factura: {facturaSeleccionada.numeroFactura}</h3>
              <button className="close-btn" onClick={() => setModalDetalleVisible(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detalle-grid">
                <div className="detalle-item">
                  <label>Número de Factura:</label>
                  <p>{facturaSeleccionada.numeroFactura}</p>
                </div>
                <div className="detalle-item">
                  <label>Monto:</label>
                  <p>Q{facturaSeleccionada.monto?.toLocaleString() || "0"}</p>
                </div>
                <div className="detalle-item">
                  <label>Moneda:</label>
                  <p>{facturaSeleccionada.moneda}</p>
                </div>
                <div className="detalle-item">
                  <label>Estado:</label>
                  <p>
                    <span
                      className="estado-badge"
                      style={{ backgroundColor: getEstadoColor(facturaSeleccionada.estado) }}
                    >
                      {facturaSeleccionada.estado}
                    </span>
                  </p>
                </div>
                <div className="detalle-item">
                  <label>Fecha Emisión:</label>
                  <p>{new Date(facturaSeleccionada.fechaEmision).toLocaleDateString()}</p>
                </div>
                <div className="detalle-item">
                  <label>Fecha Vencimiento:</label>
                  <p>{new Date(facturaSeleccionada.fechaVencimiento).toLocaleDateString()}</p>
                </div>
                <div className="detalle-item" style={{ gridColumn: "1 / -1" }}>
                  <label>Descripción:</label>
                  <p>{facturaSeleccionada.descripcion}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalDetalleVisible(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
