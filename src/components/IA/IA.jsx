import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useIA } from "../../shared/hooks/useIA";
import { useClientes } from "../../shared/hooks/useClientes";
import { ClientSelector } from "./ClientSelector";
import { IAForm } from "./IAForm";
import { IAResponse } from "./IAResponse";
import toast from "react-hot-toast";

const ROLES_PERMITIDOS = [
  "ADMINISTRADOR_ROLE",
  "CONTADOR_ROLE",
  "GERENTE_GENERAL_ROLE",
  "GERENTE_ROLE",
  "VENDEDOR_ROLE"
];

export const IA = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  
  const {
    respuesta,
    loading: iaLoading,
    error: iaError,
    preguntarAsistenteIA,
    limpiarRespuesta,
    // limpiarHistorial
  } = useIA();

  const {
    clientes,
    loading: clientesLoading,
    obtenerClientes,
    obtenerClientesPorGerenteFunc
  } = useClientes();

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [moduloActual, setModuloActual] = useState("cliente");

  // Leer parámetros de URL
  useEffect(() => {
    const clienteParam = searchParams.get("clienteId");
    const moduloParam = searchParams.get("modulo") || "cliente";
    
    setModuloActual(moduloParam);
    if (clienteParam) {
      setClienteSeleccionado(clienteParam);
    }
  }, [searchParams]);

  // Validar permisos
  useEffect(() => {
    if (!ROLES_PERMITIDOS.includes(user?.rol)) {
      toast.error("No tienes permisos para acceder a esta sección");
    }
  }, [user?.rol]);

  // Cargar clientes según rol
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        if (user?.rol === "GERENTE_ROLE" || user?.rol === "VENDEDOR_ROLE") {
          const resultado = await obtenerClientesPorGerenteFunc(user?.uid);
          if (resultado.error) {
            toast.error("Error al cargar clientes");
          }
        } else {
          const resultado = await obtenerClientes(100, 0);
          if (resultado.error) {
            toast.error("Error al cargar clientes");
          }
        }
      } catch {
        toast.error("Error al cargar clientes");
      }
    };

    cargarClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.rol, user?.uid]);

  const handlePreguntarIA = async (datos) => {
    try {
      const resultado = await preguntarAsistenteIA(
        datos.pregunta,
        moduloActual,
        datos.documentoId
      );

      if (resultado.error) {
        toast.error(resultado.data?.message || "Error al procesar la pregunta");
      } else {
        toast.success("Análisis completado");
      }
    } catch {
      toast.error("Error inesperado");
    }
  };

  const handleLimpiar = () => {
    limpiarRespuesta();
  };

  const getModuloNombre = () => {
    const nombres = {
      "cliente": "Cliente",
      "facturaPorCobrar": "Factura por Cobrar",
      "cobroCliente": "Cobro de Cliente",
      "reportes": "Reportes"
    };
    return nombres[moduloActual] || "General";
  };

  return (
    <div className="ia-container">
      <div className="ia-header">
        <h1>Análisis Inteligente de Clientes</h1>
        <p>Utiliza IA para obtener análisis detallado sobre riesgo crediticio y supervisión de cuentas</p>
        {moduloActual !== "cliente" && (
          <div className="ia-modulo-badge">
            Módulo: <strong>{getModuloNombre()}</strong>
          </div>
        )}
      </div>

      <div className="ia-content">
        <div className="ia-panel">
          <div className="ia-section">
            <h2>1. Selecciona un Cliente</h2>
            <ClientSelector
              clientes={clientes}
              selectedClienteId={clienteSeleccionado}
              onClienteSelect={setClienteSeleccionado}
              loading={clientesLoading}
            />
          </div>

          <div className="ia-section">
            <h2>2. Haz tu Pregunta</h2>
            <IAForm
              onSubmit={handlePreguntarIA}
              loading={iaLoading}
              clienteSeleccionado={clienteSeleccionado}
            />
          </div>
        </div>

        <div className="ia-response-panel">
          <h2>Respuesta de Claude IA</h2>
          <IAResponse
            respuesta={respuesta}
            loading={iaLoading}
            error={iaError}
            onLimpiar={handleLimpiar}
          />
        </div>
      </div>
    </div>
  );
};
