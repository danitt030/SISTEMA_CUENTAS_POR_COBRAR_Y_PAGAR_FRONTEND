import { useState, useEffect } from "react";

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
        const nuevosFiltros = {
            ...filtros,
            [name]: value
        };
        setFiltros(nuevosFiltros);
    };

    // Filtrar automáticamente cuando cambian los filtros
    useEffect(() => {
        const filtrosFormateados = {
            ...filtros,
            // Convertir YYYY-MM-DD a ISO string
            fechaInicio: filtros.fechaInicio ? `${filtros.fechaInicio}T00:00:00` : null,
            fechaFin: filtros.fechaFin ? `${filtros.fechaFin}T23:59:59` : null,
            accion: filtros.accion || null
        };
        
        onFiltrar(filtrosFormateados);
    }, [filtros, onFiltrar]);

    const handleReset = () => {
        setFiltros({
            fechaInicio: "",
            fechaFin: "",
            accion: "",
            usuarioId: ""
        });
    };

    const handleExportar = (e) => {
        e.preventDefault();
        
        // Formatear fechas correctamente si existen
        const filtrosFormateados = {
            ...filtros,
            fechaInicio: filtros.fechaInicio ? `${filtros.fechaInicio}T00:00:00` : null,
            fechaFin: filtros.fechaFin ? `${filtros.fechaFin}T23:59:59` : null,
            accion: filtros.accion || null
        };
        
        onExportar(filtrosFormateados);
    };

    return (
        <div className="auditoria-search-v2">
            <form className="search-form auditoria-search-form">
                <div className="auditoria-search-title-row">
                    <h3>Filtros de auditoría</h3>
                    <p>Aplica filtros por acción y rango de fechas. Se actualiza automáticamente.</p>
                </div>

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

                <div className="form-actions auditoria-form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Limpiar
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleExportar}
                        disabled={loading}
                    >
                        Exportar Excel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AuditoriaSearch;
