import { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:3002";

export const useAuditoriaSocket = (onNuevaAuditoria) => {
    useEffect(() => {
        if (!onNuevaAuditoria) return;
        
        try {
            const socket = io(SOCKET_SERVER_URL, {
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5,
                transports: ["polling", "websocket"]
            });

            // Evento de conexión exitosa
            socket.on("connect", () => {
            });

            // Escuchar nuevos eventos de auditoría
            socket.on("auditoria:nueva", (datos) => {
                onNuevaAuditoria(datos);
            });

            // Evento de desconexión
            socket.on("disconnect", () => {
            });

            // Evento de error - capturar pero no mostrar
            socket.on("error", () => {
                // Errores silenciados para evitar ruido
            });

            // Limpiar al desmontar
            return () => {
                socket.disconnect();
            };
        } catch {
            // Error al conectar socket
        }
    }, [onNuevaAuditoria]);
};

export default useAuditoriaSocket;
