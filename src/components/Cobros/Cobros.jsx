import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../shared/hooks/useAuth";
import { useCobros } from "../../shared/hooks/useCobros";
import { obtenerFacturasCobrar, obtenerClientes } from "../../services/api";
import { CobroForm } from "./CobroForm";
import { CobroList } from "./CobroList";
import { CobroDetail } from "./CobroDetail";
import { CobroSearch } from "./CobroSearch";
import "./cobros.css";
import { AuthContext } from "../../context/AuthContext";
import { puedeVerCobros, puedeEliminarCobros, puedeCrearCobro, puedeEditarCobro, puedeDesactivarCobro } from "../../utils/roleUtils";

export const Cobros = () => {
  const { user } = useAuth();
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
    obtenerCobrosPorClienteFunc,
    obtenerComisionesTotalesFunc,
    exportarCobrosFunc,
  } = useCobros();

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCobro, setSelectedCobro] = useState(null);
  const [filtroMetodo, setFiltroMetodo] = useState(null);
  const [filtroFechaInicio, setFiltroFechaInicio] = useState(null);
  const [filtroFechaFin, setFiltroFechaFin] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [comisiones, setComisiones] = useState(null);
  const [loadingComisiones, setLoadingComisiones] = useState(false);

  // Cargar cobros, facturas y clientes al montar el componente
  useEffect(() => {
    console.log("Cargando cobros...");
    obtenerCobrosFunc(100, 0);
    cargarDatos();
    cargarComisiones();
  }, [obtenerCobrosFunc]);

  // Cargar comisiones totales
  const cargarComisiones = async () => {
    setLoadingComisiones(true);
    try {
      const result = await obtenerComisionesTotalesFunc("", "");
      if (result) {
        setComisiones(result.comisiones || result);
        console.log("Comisiones cargadas:", result);
      }
    } catch (err) {
      console.error("Error al cargar comisiones:", err);
    } finally {
      setLoadingComisiones(false);
    }
  };

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
        console.log("Respuesta Facturas completa:", facturasRes);
        
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
      
      console.log("Facturas procesadas:", facturasArray);
      setFacturas(facturasArray);

      // Parsear Clientes
      let clientesArray = [];
      if (clientesRes && !clientesRes.error) {
        console.log("Respuesta Clientes completa:", clientesRes);
        
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
      
      console.log("Clientes procesados:", clientesArray);
      setClientes(clientesArray);

    } catch (err) {
      console.error("Error al cargar datos:", err);
      toast.error("Error al cargar datos de facturas y clientes");
    } finally {
      setLoadingData(false);
    }
  };

  const handleNuevoCobro = () => {
    setIsEditing(false);
    setSelectedCobro(null);
    setShowForm(true);
  };

  const handleEditarCobro = (cobro) => {
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
    } catch (err) {
      console.error("Error al guardar cobro:", err);
      toast.error("Error al guardar cobro");
      return false;
    }
  };

  const handleToggleEstadoCobro = async (id, esActivo) => {
    const nuevoEstado = !esActivo;
    const accion = nuevoEstado ? "reactivar" : "desactivar";
    if (!confirm(`¿Está seguro que desea ${accion} este cobro?`)) return;

    try {
      // Usa actualizarCobroFunc que permite cambiar el estado activo
      const result = await actualizarCobroFunc(id, { activo: nuevoEstado });
      if (result) {
        toast.success(`Cobro ${accion}do exitosamente`);
        obtenerCobrosFunc(100, 0);
      }
    } catch (err) {
      console.error(`Error al ${accion} cobro:`, err);
      toast.error(`Error al ${accion} cobro`);
    }
  };

  const handleBuscar = async (filtros) => {
    setFiltroMetodo(filtros.metodoPago || null);
    setFiltroFechaInicio(filtros.fechaInicio || null);
    setFiltroFechaFin(filtros.fechaFin || null);

    try {
      // Si hay filtro de cliente, usar obtenerCobrosPorClienteFunc
      if (filtros.cliente) {
        const resultado = await obtenerCobrosPorClienteFunc(filtros.cliente, 100, 0);
        if (resultado && Array.isArray(resultado)) {
          // Los cobros se actualizarán via cobros state si está conectado
          console.log("Cobros por cliente obtenidos:", resultado);
        }
      } else {
        // Si no hay cliente, usar búsqueda filtrada general
        const clienteId = filtros.cliente || "";
        const fechaInicio = filtros.fechaInicio || "";
        const fechaFin = filtros.fechaFin || "";
        
        await buscarCobrosFiltradosFunc(clienteId, fechaInicio, fechaFin, 100, 0);
      }
      console.log("Búsqueda realizada con filtros:", filtros);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      toast.error("Error al buscar cobros");
    }
  };

  const handleExportarCobros = async () => {
    try {
      const result = await exportarCobrosFunc();
      if (result) {
        toast.success("Cobros exportados correctamente");
        console.log("Archivo exportado:", result);
      }
    } catch (err) {
      console.error("Error al exportar:", err);
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
    } catch (err) {
      console.error("Error al eliminar permanentemente:", err);
      toast.error("Error al eliminar cobro");
    }
  };


  if (error) {
    return <div className="cobros error-message">{error}</div>;
  }

  // ==================== VERIFICACIÓN DE RBAC ====================
  const tieneAcceso = puedeVerCobros(user?.rol);
  const puedeCrear = puedeCrearCobro(user?.rol);
  const puedeEditar = puedeEditarCobro(user?.rol);
  const puedeDesactivar = puedeDesactivarCobro(user?.rol);

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
          <button className="btn-secondary" onClick={handleExportarCobros} disabled={loading || showForm || loadingData}>
            📥 Exportar a Excel
          </button>
        </div>
      </header>

      {comisiones && !showForm && (
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
              onEdit={handleEditarCobro}
              onToggleEstado={handleToggleEstadoCobro}
              onDeletePermanent={puedeEliminarCobros(user?.rol) ? handleEliminarPermanente : null}
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
