import { useState, useEffect } from "react";
import { obtenerFacturasPorCliente } from "../../services/api";
import "./FacturasDisplay.css";

export const FacturasDisplay = ({ clienteId, clienteNombre = "Cliente" }) => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clienteId) {
      setFacturas([]);
      return;
    }

    const cargarFacturas = async () => {
      setLoading(true);
      setError(null);
      try {
        const resultado = await obtenerFacturasPorCliente(clienteId, 10, 0);
        const facturasData = Array.isArray(resultado?.data?.facturas)
          ? resultado.data.facturas
          : [];
        setFacturas(facturasData);
      } catch (err) {
        console.error("Error cargando facturas:", err);
        setError("No se pudieron cargar las facturas");
        setFacturas([]);
      }
      setLoading(false);
    };

    cargarFacturas();
  }, [clienteId]);

  const getEstadoColor = (factura) => {
    if (factura.estado === "COBRADA") return "estado-pagada";
    
    const hoy = new Date();
    const vencimiento = new Date(factura.fechaVencimiento);
    
    if (vencimiento < hoy) return "estado-vencida";
    
    const diasFalta = Math.floor((vencimiento - hoy) / (1000 * 60 * 60 * 24));
    if (diasFalta <= 7) return "estado-proxima";
    
    return "estado-vigente";
  };

  const getEstadoTexto = (factura) => {
    if (factura.estado === "COBRADA") return "Pagada";
    
    const hoy = new Date();
    const vencimiento = new Date(factura.fechaVencimiento);
    
    if (vencimiento < hoy) {
      const diasAtraso = Math.floor((hoy - vencimiento) / (1000 * 60 * 60 * 24));
      return `Vencida (+${diasAtraso}d)`;
    }
    
    const diasFalta = Math.floor((vencimiento - hoy) / (1000 * 60 * 60 * 24));
    if (diasFalta <= 7) return `Próxima (${diasFalta}d)`;
    
    return "Vigente";
  };

  if (!clienteId) {
    return null;
  }

  if (loading) {
    return (
      <div className="facturas-display">
        <div className="facturas-loading">
          <div className="spinner"></div>
          <p>Cargando facturas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="facturas-display">
        <div className="facturas-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="facturas-display">
      <div className="facturas-header">
        <h3>📊 Facturas de {clienteNombre}</h3>
        <span className="facturas-count">{facturas.length}</span>
      </div>

      {facturas.length === 0 ? (
        <div className="facturas-vacio">
          <p>No hay facturas registradas para este cliente</p>
        </div>
      ) : (
        <div className="facturas-list">
          {facturas.slice(0, 5).map((factura) => (
            <div key={factura._id || factura.id} className="factura-item">
              <div className="factura-info">
                <div className="factura-numero">
                  {factura.numeroFactura || "F-000"}
                </div>
                <div className="factura-detalles">
                  <span className="factura-monto">
                    Q {(factura.monto || 0).toLocaleString("es-CO", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <span className="factura-vencimiento">
                    Vence: {new Date(factura.fechaVencimiento).toLocaleDateString("es-CO")}
                  </span>
                </div>
              </div>
              <div className={`factura-estado ${getEstadoColor(factura)}`}>
                {getEstadoTexto(factura)}
              </div>
            </div>
          ))}
        </div>
      )}

      {facturas.length > 5 && (
        <div className="facturas-footer">
          <small>Se muestran 5 de {facturas.length} facturas</small>
        </div>
      )}
    </div>
  );
};
