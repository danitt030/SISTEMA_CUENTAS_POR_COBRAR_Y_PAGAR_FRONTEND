/**
 * Validadores para el módulo IA
 */

export const validarPregunta = (pregunta) => {
  if (!pregunta || typeof pregunta !== "string") {
    return "La pregunta es requerida";
  }

  const preguntaLimpia = pregunta.trim();

  if (preguntaLimpia.length < 5) {
    return "La pregunta debe tener al menos 5 caracteres";
  }

  if (preguntaLimpia.length > 500) {
    return "La pregunta no puede exceder 500 caracteres";
  }

  return null; // Sin errores
};

export const validarModulo = (modulo) => {
  const modulosValidos = ["cliente"];
  
  if (!modulo || !modulosValidos.includes(modulo)) {
    return `El módulo debe ser uno de: ${modulosValidos.join(", ")}`;
  }

  return null;
};

export const validarDocumentoId = (documentoId) => {
  if (!documentoId) {
    return null; // Es opcional
  }

  // MongoDB ObjectId format
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
  
  if (!mongoIdRegex.test(documentoId)) {
    return "El ID del cliente no es válido";
  }

  return null;
};

/**
 * Validar todo el formulario de IA
 */
export const validarFormularioIA = (datos) => {
  const { pregunta, modulo, documentoId } = datos;
  
  const errores = {};

  const errorPregunta = validarPregunta(pregunta);
  if (errorPregunta) errores.pregunta = errorPregunta;

  const errorModulo = validarModulo(modulo);
  if (errorModulo) errores.modulo = errorModulo;

  const errorDocumentoId = validarDocumentoId(documentoId);
  if (errorDocumentoId) errores.documentoId = errorDocumentoId;

  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
};
