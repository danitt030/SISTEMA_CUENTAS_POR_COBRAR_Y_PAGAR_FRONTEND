import { useState, useCallback } from "react";
import {
    registrarEventoAuditoria,
    obtenerLogsAuditoria,
    filtrarLogsPorUsuario,
    filtrarLogsPorFechaYAccion,
    exportarLogsAuditoria
} from "../../services/api";

export const useAuditoria = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paginaInfo, setPaginaInfo] = useState({
        pagina: 1,
        limite: 50,
        total: 0,
        totalPages: 0
    });

    // 1. Registrar evento de auditoría
    const registrarEventoFunc = useCallback(async (datos) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await registrarEventoAuditoria(datos);
            if (resultado.error) {
                setError(resultado.err?.message || "Error al registrar evento");
                return null;
            }
            return resultado;
        } catch (err) {
            setError(err.message || "Error al registrar evento");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. Obtener todos los logs de auditoría
    const obtenerLogsFunc = useCallback(async (pagina = 1, limite = 50) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await obtenerLogsAuditoria(limite, pagina);
            if (resultado.error) {
                setError(resultado.err?.message || "Error al obtener logs");
                return null;
            }
            setLogs(resultado.logs || []);
            setPaginaInfo({
                pagina: resultado.pagina,
                limite: resultado.limite,
                total: resultado.total,
                totalPages: resultado.totalPaginas
            });
            return resultado;
        } catch (err) {
            setError(err.message || "Error al obtener logs");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Filtrar logs por usuario
    const filtrarPorUsuarioFunc = useCallback(async (usuarioId, pagina = 1, limite = 50) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await filtrarLogsPorUsuario(usuarioId, limite, pagina);
            if (resultado.error) {
                setError(resultado.err?.message || "Error al filtrar por usuario");
                return null;
            }
            setLogs(resultado.logs || []);
            setPaginaInfo({
                pagina: resultado.pagina,
                limite: resultado.limite,
                total: resultado.total,
                totalPages: resultado.totalPaginas
            });
            return resultado;
        } catch (err) {
            setError(err.message || "Error al filtrar por usuario");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // 4. Filtrar logs por fecha y acción
    const filtrarPorFechaYAccionFunc = useCallback(async (fechaInicio, fechaFin, accion, pagina = 1, limite = 50) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await filtrarLogsPorFechaYAccion(fechaInicio, fechaFin, accion, limite, pagina);
            if (resultado.error) {
                setError(resultado.err?.message || "Error al filtrar logs");
                return null;
            }
            setLogs(resultado.logs || []);
            setPaginaInfo({
                pagina: resultado.pagina,
                limite: resultado.limite,
                total: resultado.total,
                totalPages: resultado.totalPaginas
            });
            return resultado;
        } catch (err) {
            setError(err.message || "Error al filtrar logs");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // 5. Exportar logs a Excel
    const exportarLogsFunc = useCallback(async (fechaInicio, fechaFin, accion) => {
        setLoading(true);
        setError(null);
        try {
            const blob = await exportarLogsAuditoria(fechaInicio, fechaFin, accion);
            if (blob?.error) {
                setError(blob.err?.message || "Error al exportar logs");
                return null;
            }

            // Crear descarga del archivo
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Auditoria_${new Date().toISOString().replace(/[:.]/g, "-")}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            return { success: true };
        } catch (err) {
            setError(err.message || "Error al exportar logs");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        logs,
        loading,
        error,
        paginaInfo,
        registrarEventoFunc,
        obtenerLogsFunc,
        filtrarPorUsuarioFunc,
        filtrarPorFechaYAccionFunc,
        exportarLogsFunc
    };
};
