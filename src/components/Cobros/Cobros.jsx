import { useState, useEffect, useContext, useCallback } from "react";
import toast from "react-hot-toast";
import { useCobros } from "../../shared/hooks/useCobros";
import { obtenerFacturasCobrar, obtenerClientes } from "../../services/api";
import { CobroForm } from "./CobroForm";
import { CobroList } from "./CobroList";
import { CobroDetail } from "./CobroDetail";
import { CobroSearch } from "./CobroSearch";
import "./cobros.css";
import { AuthContext } from "../../context/AuthContext";
import { puedeVerCobros, puedeEliminarCobros, puedeCrearCobro, puedeEditarCobro, puedeDesactivarCobro, puedeExportarCobros, puedeVerComisiones } from "../../utils/roleUtils";

export const Cobros = () => {
  const { user } = useContext(AuthContext);
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
  const [_loadingComisiones, setLoadingComisiones] = useState(false);

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

    if (!confirm(`¿Está seguro que desea ${accion} este cobro?`)) return;

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
    if (!confirm("¿Está seguro que desea ELIMINAR PERMANENTEMENTE este cobro? Este cambio no se puede deshacer.")) return;

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


  if (error) {
    return <div className="cobros error-message">{error}</div>;
  }

  return (
    <div className="cobros">
      <header className="cobros-header">
        <h1>Gestión de Cobros</h1>
        <div className="header-actions">
          {puedeCrear && (
            <button className="btn-primary" onClick={handleNuevoCobro} disabled={loading || showForm || loadingData}>
              + Nuevo Cobro
            </button>
          )}
          {puedeExportar && (
            <button className="btn-secondary" onClick={handleExportarCobros} disabled={loading || showForm || loadingData}>
              📥 Exportar a Excel
            </button>
          )}
        </div>
      </header>

      {comisiones && !showForm && puedeVerComisionesTotales && (
        <section className="cobros-stats">
          <div className="stat-card">
            <h3>Total Cobrado</h3>
            <p className="stat-value">Q {comisiones.totalCobros?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="stat-card">
            <h3>Total Comisiones</h3>
            <p className="stat-value">Q {comisiones.totalComisiones?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="stat-card">
            <h3>Neto Cobrado</h3>
            <p className="stat-value">Q {comisiones.totalNeto?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="stat-card">
            <h3>Cantidad de Cobros</h3>
            <p className="stat-value">{comisiones.cantidadCobros || 0}</p>
          </div>
        </section>
      )}

      {showForm && (
        <section className="cobros-form-section">
          <h2>{isEditing ? "Editar Cobro" : "Crear Nuevo Cobro"}</h2>
          <CobroForm
            cobro={isEditing ? selectedCobro : null}
            onSubmit={handleSubmitForm}
            loading={loading}
            onCancel={handleCancelar}
            facturas={facturas}
            clientes={clientes}
          />
        </section>
      )}

      {!showForm && (
        <>
          <section className="cobros-search-section">
            <h2>Filtrar Cobros</h2>
            <CobroSearch onSearch={handleBuscar} clientes={clientes} loading={loading} />
          </section>

          <section className="cobros-list-section">
            <h2>Listado de Cobros ({cobros.length})</h2>
            <CobroList
              cobros={cobros}
              onEdit={puedeEditar ? handleEditarCobro : null}
              onToggleEstado={puedeDesactivar ? handleToggleEstadoCobro : null}
              onDeletePermanent={puedeEliminar ? handleEliminarPermanente : null}
              loading={loading}
            />
          </section>
        </>
      )}

      {selectedCobro && !showForm && (
        <CobroDetail
          cobro={selectedCobro}
          onClose={() => setSelectedCobro(null)}
          onEdit={handleEditarCobro}
          obtenerSaldoCobroFunc={obtenerSaldoCobroFunc}
          obtenerCobroPorIdFunc={obtenerCobroPorIdFunc}
        />
      )}
    </div>
  );
};
