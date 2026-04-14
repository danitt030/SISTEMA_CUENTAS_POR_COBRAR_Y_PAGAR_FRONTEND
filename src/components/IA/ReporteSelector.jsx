import "./ReporteSelector.css";

export const ReporteSelector = ({ onSelect, selected }) => {
  const reportes = [
    {
      id: "saldos",
      nombre: "📊 Resumen de Saldos",
      descripcion: "Análisis de saldos totales, cobrados y pendientes"
    },
    {
      id: "proveedores",
      nombre: "📦 Resumen por Proveedor",
      descripcion: "Desglose de facturas y pagos por cada proveedor"
    },
    {
      id: "clientes",
      nombre: "👥 Resumen por Cliente",
      descripcion: "Análisis de actividad y deuda por cliente"
    },
    {
      id: "vencer",
      nombre: "⏰ Facturas por Vencer",
      descripcion: "Facturas próximas a vencer en los próximos 15-30 días"
    },
    {
      id: "vencidas",
      nombre: "⚠️ Facturas Vencidas",
      descripcion: "Análisis de facturas vencidas y en mora"
    },
    {
      id: "cobrabilidad",
      nombre: "📈 Cobrabilidad",
      descripcion: "Porcentaje de cobro y tendencias de recuperación"
    },
    {
      id: "pagabilidad",
      nombre: "📉 Pagabilidad",
      descripcion: "Análisis de pagos a proveedores y cumplimiento"
    },
    {
      id: "estado",
      nombre: "🔀 Facturas por Estado",
      descripcion: "Distribución de facturas por estado (pendiente, cobrada, vencida)"
    },
    {
      id: "topdeudores",
      nombre: "🥇 Top Clientes Deudores",
      descripcion: "Los clientes con mayor deuda pendiente"
    },
    {
      id: "topproveedores",
      nombre: "🥈 Top Proveedores",
      descripcion: "Proveedores con mayor gasto acumulado"
    },
    {
      id: "comisiones",
      nombre: "💵 Análisis de Comisiones",
      descripcion: "Desglose de comisiones ganadas y tendencias"
    }
  ];

  return (
    <div className="reporte-selector">
      <label htmlFor="reporte-select">
        📋 Selecciona un Reporte para Analizar:
      </label>

      <select
        id="reporte-select"
        value={selected || ""}
        onChange={(e) => onSelect(e.target.value || null)}
        className="reporte-select"
      >
        <option value="">-- Elige un reporte --</option>
        {reportes.map((reporte) => (
          <option key={reporte.id} value={reporte.id}>
            {reporte.nombre}
          </option>
        ))}
      </select>

      {selected && (
        <div className="reporte-descripcion">
          {reportes.find(r => r.id === selected) && (
            <p>
              {reportes.find(r => r.id === selected).descripcion}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
