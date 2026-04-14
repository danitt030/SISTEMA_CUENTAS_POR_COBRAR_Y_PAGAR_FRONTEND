import { useState, useEffect } from "react";
import { obtenerCobrosPorCliente } from "../../services/api";
import "./CobrosDisplay.css";

export const CobrosDisplay = ({ clienteId, clienteNombre = "Cliente" }) => {
  const [cobros, setCobros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clienteId) {
      const resetCobros = () => {
        setCobros([]);
      };
      resetCobros();
      return;
    }

    const cargarCobros = async () => {
      setLoading(true);
      setError(null);
      try {
        const resultado = await obtenerCobrosPorCliente(clienteId, 10, 0);
        const cobrosData = Array.isArray(resultado?.data?.cobros)
          ? resultado.data.cobros
          : [];
        setCobros(cobrosData);
      } catch (err) {
        console.error("Error cargando cobros:", err);
        setError("No se pudieron cargar los cobros");
        setCobros([]);
      }
      setLoading(false);
    };

    cargarCobros();
  }, [clienteId]);

  if (!clienteId) {
    return null;
  }

  if (loading) {
    return (
      <div className="cobros-display">
        <div className="cobros-loading">
          <div className="spinner"></div>
          <p>Cargando cobros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cobros-display">
        <div className="cobros-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cobros-display">
      <div className="cobros-header">
        <h3>💵 Cobros de {clienteNombre}</h3>
        <span className="cobros-count">{cobros.length}</span>
      </div>

      {cobros.length === 0 ? (
        <div className="cobros-vacio">
          <p>No hay cobros registrados para este cliente</p>
        </div>
      ) : (
        <div className="cobros-list">
          {cobros.slice(0, 5).map((cobro) => (
            <div key={cobro._id || cobro.id} className="cobro-item">
              <div className="cobro-info">
                <div className="cobro-monto">
                  Q {(cobro.montoCobrado || 0).toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
                <div className="cobro-detalles">
                  <span className="cobro-fecha">
                    {new Date(cobro.fechaCobro).toLocaleDateString("es-CO")}
                  </span>
                  {cobro.comision && (
                    <span className="cobro-comision">
                      Comisión: Q {(cobro.comision || 0).toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  )}
                </div>
              </div>
              <div className="cobro-estado">
                ✓ Cobrado
              </div>
            </div>
          ))}
        </div>
      )}

      {cobros.length > 5 && (
        <div className="cobros-footer">
          <small>Se muestran 5 de {cobros.length} cobros</small>
        </div>
      )}
    </div>
  );
};
