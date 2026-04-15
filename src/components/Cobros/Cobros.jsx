import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCobros } from "../../shared/hooks/useCobros";
import { obtenerFacturasCobrar, obtenerClientes } from "../../services/api";
import { CobroForm } from "./CobroForm";
import { CobroList } from "./CobroList";
import { CobroDetail } from "./CobroDetail";
import { CobroSearch } from "./CobroSearch";
import { StatsSection } from "../Common/StatsSection";
import { AuthContext } from "../../context/AuthContext";
import { puedeVerCobros, puedeEliminarCobros, puedeCrearCobro, puedeEditarCobro, puedeDesactivarCobro, puedeExportarCobros, puedeVerComisiones } from "../../utils/roleUtils";
import "../../styles/modules.css";

export const Cobros = ({ onBack }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    cobros = [],
    loading,
    error,
    obtenerCobrosFunc,
    obtenerCobroPorIdFunc,
    crearCobroFunc,
    actualizarCobroFunc,
    buscarCobrosFiltradosFunc,
    desactivarCobroFunc,
    eliminarCobroFunc,
    obtenerSaldoCobroFunc,
    obtenerComisionesTotalesFunc,
    exportarCobrosFunc,
  } = useCobros();

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCobro, setSelectedCobro] = useState(null);
  const [_filtroMetodo, setFiltroMetodo] = useState(null);
  const [_filtroFechaInicio, setFiltroFechaInicio] = useState(null);
  const [_filtroFechaFin, setFiltroFechaFin] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [comisiones, setComisiones] = useState(null);
  const [loadingComisiones, setLoadingComisiones] = useState(false);

  // Estados para modales de confirmación
  const [modalDesactivar, setModalDesactivar] = useState({ visible: false, cobro: null });
  const [modalEliminar, setModalEliminar] = useState({ visible: false, cobro: null });

  // Cargar comisiones totales
  const cargarComisiones = useCallback(async () => {
    setLoadingComisiones(true);
    try {
      const result = await obtenerComisionesTotalesFunc("", "");
      if (result) {
        setComisiones(result.comisiones || result);
      }
    } finally {
      setLoadingComisiones(false);
    }
  }, [obtenerComisionesTotalesFunc]);

  // Cargar cobros, facturas y clientes al montar el componente
  useEffect(() => {
    obtenerCobrosFunc(100, 0);
    cargarDatos();
    cargarComisiones();
  }, [obtenerCobrosFunc, cargarComisiones]);

  const cargarDatos = async () => {
    setLoadingData(true);
    try {
      const [facturasRes, clientesRes] = await Promise.all([
        obtenerFacturasCobrar(1000, 0),
        obtenerClientes(1000, 0),
      ]);

      // Parsear Facturas
      let facturasArray = [];
      if (facturasRes && !facturasRes.error) {
        
        // Intentar obtener datos de diferentes estructuras posibles
        if (facturasRes.data) {
          if (Array.isArray(facturasRes.data)) {
            facturasArray = facturasRes.data;
          } else if (Array.isArray(facturasRes.data.data)) {
            facturasArray = facturasRes.data.data;
          } else if (Array.isArray(facturasRes.data.facturas)) {
            facturasArray = facturasRes.data.facturas;
          } else if (facturasRes.data.data && Array.isArray(facturasRes.data.data.data)) {
            facturasArray = facturasRes.data.data.data;
          }
        }
      }
      
      setFacturas(facturasArray);

      // Parsear Clientes
      let clientesArray = [];
      if (clientesRes && !clientesRes.error) {
        
        // Intentar obtener datos de diferentes estructuras posibles
        if (clientesRes.data) {
          if (Array.isArray(clientesRes.data)) {
            clientesArray = clientesRes.data;
          } else if (Array.isArray(clientesRes.data.data)) {
            clientesArray = clientesRes.data.data;
          } else if (Array.isArray(clientesRes.data.clientes)) {
            clientesArray = clientesRes.data.clientes;
          } else if (clientesRes.data.data && Array.isArray(clientesRes.data.data.data)) {
            clientesArray = clientesRes.data.data.data;
          }
        }
      }
      
      setClientes(clientesArray);

    } catch {
      toast.error("Error al cargar datos de facturas y clientes");
    } finally {
      setLoadingData(false);
    }
  };

  // ==================== VERIFICACIÓN DE RBAC ====================
  const tieneAcceso = puedeVerCobros(user?.rol);
  const puedeCrear = puedeCrearCobro(user?.rol);
  const puedeEditar = puedeEditarCobro(user?.rol);
  const puedeDesactivar = puedeDesactivarCobro(user?.rol);
  const puedeEliminar = puedeEliminarCobros(user?.rol);
  const puedeExportar = puedeExportarCobros(user?.rol);
  const puedeVerComisionesTotales = puedeVerComisiones(user?.rol);

  if (!tieneAcceso) {
    return (
      <div className="cobros-container">
        <div className="alert alert-danger" style={{ margin: "20px" }}>
          <strong>Acceso Denegado</strong>
          <p>No tienes permisos para acceder al módulo de Cobros</p>
        </div>
      </div>
    );
  }

  const handleNuevoCobro = () => {
    if (!puedeCrearCobro(user?.rol)) {
      toast.error("No tienes permisos para crear cobros");
      return;
    }
    setIsEditing(false);
    setSelectedCobro(null);
    setShowForm(true);
  };

  const handleEditarCobro = (cobro) => {
    if (!puedeEditarCobro(user?.rol)) {
      toast.error("No tienes permisos para editar cobros");
      return;
    }
    setIsEditing(true);
    setSelectedCobro(cobro);
    setShowForm(true);
  };

  const handleCancelar = () => {
    setShowForm(false);
    setIsEditing(false);
    setSelectedCobro(null);
  };

  const handleSubmitForm = async (datosObjeto) => {
    try {
      if (isEditing && selectedCobro) {
        // En modo edición, datosObjeto es { datosEnvio, cobroId }
        const { datosEnvio, cobroId } = datosObjeto;
        const result = await actualizarCobroFunc(cobroId || selectedCobro._id || selectedCobro.id, datosEnvio);
        if (result) {
          toast.success("Cobro actualizado exitosamente");
          handleCancelar();
          obtenerCobrosFunc(100, 0);
          return true;
        }
      } else {
        // En modo creación, datosObjeto es directamente los datos
        const result = await crearCobroFunc(datosObjeto);
        if (result) {
          toast.success("Cobro creado exitosamente");
          handleCancelar();
          obtenerCobrosFunc(100, 0);
          return true;
        }
      }
      return false;
    } catch {
      toast.error("Error al guardar cobro");
      return false;
    }
  };

  const handleToggleEstadoCobro = async (id, esActivo) => {
    const nuevoEstado = !esActivo;
    const accion = nuevoEstado ? "reactivar" : "desactivar";

    // Validar permisos
    if (!puedeDesactivar) {
      toast.error("No tienes permisos para desactivar/reactivar cobros");
      return;
    }

    try {
      // Usar desactivarCobroFunc si es desactivación (activo: false)
      // Para reactivación (activo: true), usar actualizarCobroFunc
      let result;
      if (!nuevoEstado) {
        // Desactivar: usar desactivarCobroFunc
        result = await desactivarCobroFunc(id);
      } else {
        // Reactivar: usar actualizarCobroFunc con { activo: true }
        result = await actualizarCobroFunc(id, { activo: true });
      }

      if (result) {
        toast.success(`Cobro ${accion}do exitosamente`);
        obtenerCobrosFunc(100, 0);
      }
    } catch {
      toast.error(`Error al ${accion} cobro`);
    }
  };

  const handleBuscar = async (filtros) => {
    try {
      // Actualizar estado de filtros
      setFiltroMetodo(filtros.metodoPago || null);
      setFiltroFechaInicio(filtros.fechaInicio || null);
      setFiltroFechaFin(filtros.fechaFin || null);

      // Acumular todos los filtros activos
      const clienteId = filtros.cliente || "";
      const fechaInicio = filtros.fechaInicio || "";
      const fechaFin = filtros.fechaFin || "";
      const metodoPago = filtros.metodoPago || "";

      // Usar buscarCobrosFiltradosFunc con TODOS los filtros (sin importar si cliente existe o no)
      // porque esta función maneja mejor múltiples filtros
      await buscarCobrosFiltradosFunc(
        clienteId,
        fechaInicio,
        fechaFin,
        metodoPago,
        100,
        0
      );
    } catch {
      toast.error("Error al buscar cobros");
    }
  };

  const handleExportarCobros = async () => {
    // Validar permisos
    if (!puedeExportar) {
      toast.error("No tienes permisos para exportar cobros");
      return;
    }

    try {
      const result = await exportarCobrosFunc();
      if (result) {
        toast.success("Cobros exportados correctamente");
      }
    } catch {
      toast.error("Error al exportar cobros");
    }
  };

  const handleEliminarPermanente = async (id) => {
    try {
      const result = await eliminarCobroFunc(id);
      if (result) {
        toast.success("Cobro eliminado permanentemente");
        obtenerCobrosFunc(100, 0);
      }
    } catch {
      toast.error("Error al eliminar cobro");
    }
  };

  const handlePreguntarIA = () => {
    navigate("/ia/cobros");
  };

  const mapStats = () => {
    if (!comisiones) return [];
    return [
      {
        label: "Total Cobrado",
        value: `Q ${parseFloat(comisiones.totalCobros || 0).toFixed(2)}`,
        color: "#2196F3",
      },
      {
        label: "Total Comisiones",
        value: `Q ${parseFloat(comisiones.totalComisiones || 0).toFixed(2)}`,
        color: "#FF9800",
      },
      {
        label: "Neto Cobrado",
        value: `Q ${parseFloat(comisiones.totalNeto || 0).toFixed(2)}`,
        color: "#4CAF50",
      },
      {
        label: "Cantidad de Cobros",
        value: comisiones.cantidadCobros || 0,
        color: "#9C27B0",
      },
    ];
  };

  if (error) {
    return <div className="module-container error-message">{error}</div>;
  }

  return (
    <div className="module-container table-density-compact">
      <div className="module-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          {typeof onBack === 'function' && (
            <button
              onClick={onBack}
              className="btn btn-primary"
              style={{ padding: '8px 12px', fontSize: '14px' }}
            >
              ← Volver
            </button>
          )}
          <h2>Gestión de Cobros</h2>
        </div>
        <div className="header-acciones">
          {puedeCrear && (
            <button className="btn btn-primary" onClick={handleNuevoCobro} disabled={loading || showForm || loadingData}>
              Nuevo Cobro
            </button>
          )}
          {puedeExportar && (
            <button className="btn btn-secondary" onClick={handleExportarCobros} disabled={loading || showForm || loadingData}>
              Exportar a Excel
            </button>
          )}
          <button className="btn btn-ia" onClick={handlePreguntarIA}>
            Preguntar IA
          </button>
        </div>
      </div>

      {puedeVerComisionesTotales && (
        <StatsSection stats={mapStats()} loading={loadingComisiones} />
      )}

      <div className="cobros-contenido">
        <div className="search-section">
          <CobroSearch onSearch={handleBuscar} clientes={clientes} loading={loading} />
        </div>

        <div className="table-section">
          <CobroList
            cobros={cobros}
            onVerDetalle={(cobro) => setSelectedCobro(cobro)}
            onEdit={puedeEditar ? handleEditarCobro : null}
            onToggleEstado={puedeDesactivar ? (id, esActivo) => {
              if (esActivo === false) {
                // Reactivar directo
                handleToggleEstadoCobro(id, false);
              } else {
                setModalDesactivar({ visible: true, cobro: { id } });
              }
            } : null}
            onDeletePermanent={puedeEliminar ? (id) => setModalEliminar({ visible: true, cobro: { id } }) : null}
            loading={loading}
          />
        </div>
      </div>

      {/* MODAL COBRO FORM */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCancelar}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{animation: 'fadeInZoom 0.3s ease-out'}}>
            <div className="modal-header">
              <h3>{isEditing ? "Editar Cobro" : "Crear Nuevo Cobro"}</h3>
              <button className="btn-close" onClick={handleCancelar}>×</button>
            </div>
            <div className="modal-body p-6 form-readable">
              <CobroForm
                cobro={isEditing ? selectedCobro : null}
                onSubmit={handleSubmitForm}
                loading={loading}
                onCancel={handleCancelar}
                facturas={facturas}
                clientes={clientes}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL DESACTIVAR COBRO */}
      {modalDesactivar.visible && (
        <div className="modal-overlay" onClick={() => setModalDesactivar({ visible: false, cobro: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: 'fadeInZoom 0.3s ease-out' }}>
            <div className="modal-header">
              <h3>Confirmar Desactivacion</h3>
              <button className="btn-close" onClick={() => setModalDesactivar({ visible: false, cobro: null })}>×</button>
            </div>
            <div className="modal-body text-center p-6">
              <div className="text-5xl mb-4">!</div>
              <p className="text-gray-900 dark:text-gray-300 mb-6 font-medium">¿Estás seguro que deseas desactivar este cobro? Podrás reactivarlo o verlo después.</p>
              <div className="flex justify-center space-x-4">
                <button className="btn btn-secondary px-6" onClick={() => setModalDesactivar({ visible: false, cobro: null })}>Cancelar</button>
                <button className="btn btn-danger px-6 font-bold shadow-md hover:shadow-red-500/30 bg-red-600 hover:bg-red-700 text-white" onClick={() => {
                  handleToggleEstadoCobro(modalDesactivar.cobro.id, true);
                  setModalDesactivar({ visible: false, cobro: null });
                }}>Desactivar Cobro</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR COBRO */}
      {modalEliminar.visible && (
        <div className="modal-overlay" onClick={() => setModalEliminar({ visible: false, cobro: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ animation: 'fadeInZoom 0.3s ease-out' }}>
            <div className="modal-header border-b border-red-500/30">
              <h3 className="text-red-600 dark:text-red-400">Eliminar Permanente</h3>
              <button className="btn-close" onClick={() => setModalEliminar({ visible: false, cobro: null })}>×</button>
            </div>
            <div className="modal-body text-center p-6 bg-red-50 dark:bg-red-950/20">
              <div className="text-6xl mb-4">X</div>
              <p className="text-red-600 dark:text-red-300 mb-2 font-bold text-lg">ADVERTENCIA</p>
              <p className="text-red-700 dark:text-red-200/80 mb-6 font-medium">Esta acción no se puede deshacer. El cobro será eliminado permanentemente de la base de datos.</p>
              <div className="flex justify-center space-x-4">
                <button className="btn btn-secondary px-6 border dark:border-gray-600" onClick={() => setModalEliminar({ visible: false, cobro: null })}>Cancelar</button>
                <button className="btn px-6 bg-red-600 hover:bg-red-700 text-white font-bold" style={{boxShadow: '0 0 15px rgba(220, 38, 38, 0.4)'}} onClick={() => {
                  handleEliminarPermanente(modalEliminar.cobro.id);
                  setModalEliminar({ visible: false, cobro: null });
                }}>Sí, Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETALLE COBRO EN MODAL */}
      {selectedCobro && !showForm && !modalDesactivar.visible && !modalEliminar.visible && (
        <CobroDetail
          cobro={selectedCobro}
          onClose={() => setSelectedCobro(null)}
          onEdit={() => { setSelectedCobro(null); handleEditarCobro(selectedCobro); }}
          obtenerSaldoCobroFunc={obtenerSaldoCobroFunc}
          obtenerCobroPorIdFunc={obtenerCobroPorIdFunc}
        />
      )}
    </div>
  );
};
