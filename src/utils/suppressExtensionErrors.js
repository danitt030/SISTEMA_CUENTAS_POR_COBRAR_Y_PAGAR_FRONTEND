/**
 * Suprime errores causados por extensiones de Chrome
 * No afecta la funcionalidad de la aplicación
 */
export const suppressExtensionErrors = () => {
  // Suprimir error de conexión de extensiones
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args) => {
    const message = String(args[0]);
    // Suprimir errores de extensiones de Chrome
    if (
      message.includes("Could not establish connection") ||
      message.includes("Receiving end does not exist") ||
      message.includes("smart_favorite") ||
      message.includes("permission error")
    ) {
      return; // No mostrar
    }
    originalWarn(...args);
  };

  console.error = (...args) => {
    const message = String(args[0]);
    // Suprimir errores de extensiones de Chrome y HMR
    if (
      message.includes("Could not establish connection") ||
      message.includes("Receiving end does not exist") ||
      message.includes("smart_favorite") ||
      message.includes("permission error") ||
      message.includes("Failed to reload") ||
      message.includes("net::ERR_ABORTED")
    ) {
      return; // No mostrar
    }
    originalError(...args);
  };

  // Atrapar errores no capturados de extensiones
  window.addEventListener("error", (event) => {
    const message = event.message || String(event);
    if (
      message.includes("Could not establish connection") ||
      message.includes("Receiving end does not exist") ||
      message.includes("smart_favorite") ||
      message.includes("permission error")
    ) {
      event.preventDefault();
      return true; // Suprimir el error
    }
  }, true); // Usar captura para interceptar antes

  // Atrapar promesas rechazadas no capturadas - CRÍTICO para content-scripts
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason || {};
    const message = reason.message || reason.code || String(reason);
    
    if (
      message.includes("Could not establish connection") ||
      message.includes("Receiving end does not exist") ||
      message === "permission error" ||
      message === 403 ||
      message.includes("smart_favorite") ||
      (reason.name === 'Error' && message.includes("Could not establish connection"))
    ) {
      event.preventDefault();
      return true; // Suprimir el rechazo
    }
  }, true); // Usar captura para interceptar antes
};
