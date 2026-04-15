import { useState } from "react";
import { validarFormularioIA } from "../../shared/validadores/iaValidators";

export const IAForm = ({ onSubmit, loading = false, clienteSeleccionado = null, modulo = "cliente" }) => {
  const [pregunta, setPregunta] = useState("");
  const [errores, setErrores] = useState({});
  const [caracteresRestantes, setCaracteresRestantes] = useState(500);
  
  // Determinar si el módulo requiere cliente seleccionado
  const requiereCliente = modulo === "cliente";

  const handlePreguntaChange = (e) => {
    const valor = e.target.value;
    setPregunta(valor);
    setCaracteresRestantes(500 - valor.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrores({});

    // Validar
    const validacion = validarFormularioIA({
      pregunta,
      modulo,
      documentoId: clienteSeleccionado
    });

    if (!validacion.valido) {
      setErrores(validacion.errores);
      return;
    }

    // Enviar
    onSubmit({
      pregunta: pregunta.trim(),
      modulo,
      documentoId: clienteSeleccionado || null
    });

    // Limpiar
    setPregunta("");
    setCaracteresRestantes(500);
  };

  return (
    <form className="ia-form" onSubmit={handleSubmit}>
      <div className="ia-form-group">
        <label htmlFor="pregunta">Tu Pregunta:</label>
        <textarea
          id="pregunta"
          value={pregunta}
          onChange={handlePreguntaChange}
          placeholder="Ej: ¿Cuál es el riesgo crediticio de este cliente? ¿Necesita aumentar su límite de crédito?"
          className={`ia-textarea ${errores.pregunta ? "error" : ""}`}
          disabled={loading || (requiereCliente && !clienteSeleccionado)}
          rows="4"
        />
        <div className="ia-char-count">
          {caracteresRestantes} caracteres restantes
        </div>
        {errores.pregunta && (
          <span className="ia-error-text">{errores.pregunta}</span>
        )}
      </div>

      <button
        type="submit"
        className="ia-submit-btn"
        disabled={loading || (requiereCliente && !clienteSeleccionado) || !pregunta.trim()}
      >
        {loading ? "Analizando..." : "Analizar con IA"}
      </button>

      {requiereCliente && !clienteSeleccionado && (
        <p className="ia-info-text">Selecciona un cliente primero para hacer una pregunta</p>
      )}
    </form>
  );
};
