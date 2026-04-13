import { useState, useCallback, useEffect } from "react";
import * as api from "../../services/api";

export const useProveedoresStats = () => {
    const [stats, setStats] = useState({
        total: 0,
        contado: 0,
        credito: 0,
        activos: 0
    });
    const [loading, setLoading] = useState(false);

    const cargarEstadisticas = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.obtenerProveedores(1000, 0);
            
            if (response.error) {
                throw new Error(response.err?.message || "Error al obtener proveedores");
            }

            const proveedores = response.data?.proveedores || 
                              response.data?.data || 
                              response.proveedores || 
                              (Array.isArray(response) ? response : []);

            const arrayProveedores = Array.isArray(proveedores) ? proveedores : [];

            const statsCalculadas = {
                total: arrayProveedores.length,
                contado: arrayProveedores.filter(p => p.condicionPago === "CONTADO").length,
                credito: arrayProveedores.filter(p => p.condicionPago === "CRÉDITO" || p.condicionPago === "CREDITO").length,
                activos: arrayProveedores.filter(p => p.estado === true).length
            };

            setStats(statsCalculadas);
        } catch (error) {
            console.error("Error en useProveedoresStats:", error);
            setStats({
                total: 0,
                contado: 0,
                credito: 0,
                activos: 0
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

export default useProveedoresStats;
