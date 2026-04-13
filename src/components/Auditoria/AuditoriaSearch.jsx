import { useState } from "react";
import "./auditoriaSearch.css";

const AuditoriaSearch = ({ onFiltrar, onExportar, loading }) => {
    const [filtros, setFiltros] = useState({
        fechaInicio: "",
        fechaFin: "",
        accion: "",
        usuarioId: ""
    });

    const acciones = ["CREAR", "ACTUALIZAR", "ELIMINAR", "LEER", "EXPORTAR", "DESCARGAR", "LOGIN", "LOGOUT"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFiltrar = (e) => {
        e.preventDefault();
        onFiltrar(filtros);
    };

    const handleReset = () => {
        setFiltros({
            fechaInicio: "",
            fechaFin: "",
            accion: "",
            usuarioId: ""
        });
        onFiltrar({});
    };

    const handleExportar = (e) => {
        e.preventDefault();
        onExportar(filtros);
    };

    return (
        <div className="auditoria-search">
            <form className="search-form">
                <div className="form-group">
                    <label htmlFor="accion">Acción</label>
                    <select
                        id="accion"
                        name="accion"
                        value={filtros.accion}
                        onChange={handleInputChange}
                        className="form-control"
                    >
                        <option value="">-- Todas las acciones --</option>
                        {acciones.map(acc => (
                            <option key={acc} value={acc}>{acc}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="fechaInicio">Fecha Inicio</label>
                    <input
                        type="date"
                        id="fechaInicio"
                        name="fechaInicio"
                        value={filtros.fechaInicio}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="fechaFin">Fecha Fin</label>
                    <input
                        type="date"
                        id="fechaFin"
                        name="fechaFin"
                        value={filtros.fechaFin}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-filtrar"
                        onClick={handleFiltrar}
                        disabled={loading}
                    >
                        🔍 Filtrar
                    </button>
                    <button
                        type="button"
                        className="btn btn-reset"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        🔄 Limpiar
                    </button>
                    <button
                        type="button"
                        className="btn btn-exportar"
                        onClick={handleExportar}
                        disabled={loading}
                    >
                        📥 Exportar Excel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AuditoriaSearch;
