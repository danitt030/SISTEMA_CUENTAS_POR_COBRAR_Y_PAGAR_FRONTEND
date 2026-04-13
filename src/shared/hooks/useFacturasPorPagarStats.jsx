import { useState, useCallback, useEffect } from "react";
import * as api from "../../services/api";

export const useFacturasPorPagarStats = () => {
    const [stats, setStats] = useState({
        total: 0,
        pendientes: 0,
        pagadas: 0,
        montoTotal: 0
    });
    const [loading, setLoading] = useState(false);

    const cargarEstadisticas = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.obtenerFacturasPagar(1000, 0);
            
            if (response.error) {
                throw new Error(response.err?.message || "Error al obtener facturas");
            }

            const facturas = response.data?.facturas || 
                           response.data?.data || 
                           response.facturas || 
                           (Array.isArray(response) ? response : []);

            const arrayFacturas = Array.isArray(facturas) ? facturas : [];

            const statsCalculadas = {
                total: arrayFacturas.length,
                pendientes: arrayFacturas.filter(f => f.estado === "PENDIENTE").length,
                pagadas: arrayFacturas.filter(f => f.estado === "PAGADA").length,
                montoTotal: arrayFacturas.reduce((sum, f) => sum + (f.monto || 0), 0)
            };

            setStats(statsCalculadas);
        } catch {
            setStats({
                total: 0,
                pendientes: 0,
                pagadas: 0,
                montoTotal: 0
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarEstadisticas();
    }, [cargarEstadisticas]);

    return { stats, loading };
};

export default useFacturasPorPagarStats;
