import { useState } from "react";

export const CobroSearch = ({ onSearch, clientes = [], loading = false }) => {
  const [filtros, setFiltros] = useState({
    cliente: "",
    metodoPago: "",
    fechaInicio: "",
    fechaFin: ""
  });

  const handleClienteChange = (e) => {
    const nuevosFiltros = { ...filtros, cliente: e.target.value };
    setFiltros(nuevosFiltros);
    onSearch(nuevosFiltros);
  };

  const handleMetodoPagoChange = (e) => {
    const nuevosFiltros = { ...filtros, metodoPago: e.target.value };
    setFiltros(nuevosFiltros);
    onSearch(nuevosFiltros);
  };

  const handleFechaDesdeChange = (e) => {
    const nuevosFiltros = { ...filtros, fechaInicio: e.target.value };
    setFiltros(nuevosFiltros);
    onSearch(nuevosFiltros);
  };

  const handleFechaHastaChange = (e) => {
    const nuevosFiltros = { ...filtros, fechaFin: e.target.value };
    setFiltros(nuevosFiltros);
    onSearch(nuevosFiltros);
  };

  const handleLimpiar = () => {
    const filtrosLimpios = {
      cliente: "",
      metodoPago: "",
      fechaInicio: "",
      fechaFin: ""
    };
    setFiltros(filtrosLimpios);
    onSearch(filtrosLimpios);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="flex flex-col">
          <label htmlFor="cliente" className="text-sm font-semibold text-black dark:text-gray-300 mb-1">Cliente</label>
          <select
            id="cliente"
            value={filtros.cliente}
            onChange={handleClienteChange}
            disabled={loading || clientes.length === 0}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black dark:text-gray-200"
          >
            <option value="">Todos los clientes</option>
            {clientes.map((cliente) => (
              <option key={cliente.id || cliente._id} value={cliente.id || cliente._id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="metodoPago" className="text-sm font-semibold text-black dark:text-gray-300 mb-1">Método Pago</label>
          <select
            id="metodoPago"
            value={filtros.metodoPago}
            onChange={handleMetodoPagoChange}
            disabled={loading}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black dark:text-gray-200"
          >
            <option value="">Todos</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="CHEQUE">Cheque</option>
            <option value="TARJETA">Tarjeta</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="fechaDesde" className="text-sm font-semibold text-black dark:text-gray-300 mb-1">Fecha Desde</label>
          <input
            id="fechaDesde"
            type="date"
            value={filtros.fechaInicio}
            onChange={handleFechaDesdeChange}
            disabled={loading}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black dark:text-gray-200"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="fechaHasta" className="text-sm font-semibold text-black dark:text-gray-300 mb-1">Fecha Hasta</label>
          <input
            id="fechaHasta"
            type="date"
            value={filtros.fechaFin}
            onChange={handleFechaHastaChange}
            disabled={loading}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black dark:text-gray-200"
          />
        </div>

        <button 
          onClick={handleLimpiar} 
          disabled={loading}
          className="h-[42px] bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg font-semibold transition-all border border-red-200 dark:border-red-800/30 flex items-center justify-center gap-2"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};
