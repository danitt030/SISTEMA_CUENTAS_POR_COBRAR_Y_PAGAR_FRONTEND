import "./pagination.css";

const Pagination = ({ pagina, totalPaginas, onPaginaChange }) => {
    // Mostrar siempre (aunque sea una página, para debug)
    if (!pagina || !totalPaginas) {
        return null;
    }

    const handleAnterior = () => {
        if (pagina > 1) {
            onPaginaChange(pagina - 1);
        }
    };

    const handleSiguiente = () => {
        if (pagina < totalPaginas) {
            onPaginaChange(pagina + 1);
        }
    };

    const paginas = [];
    const rango = 2; // Mostrar 2 páginas a cada lado de la actual

    for (let i = Math.max(1, pagina - rango); i <= Math.min(totalPaginas, pagina + rango); i++) {
        paginas.push(i);
    }

    return (
        <div className="pagination-container">
            {/* Flecha Izquierda */}
            <button 
                className="btn-flecha btn-flecha-izquierda"
                onClick={handleAnterior}
                disabled={pagina === 1}
                title="Página anterior"
            >
                <span className="flecha-icon">❮</span>
            </button>

            {/* Información de Página */}
            <span className="pagination-info">
                Página {pagina} de {totalPaginas}
            </span>

            {/* Números de Página */}
            <div className="pagination-numeros">
                {pagina > 1 + rango && (
                    <>
                        <button onClick={() => onPaginaChange(1)}>1</button>
                        <span className="ellipsis">...</span>
                    </>
                )}

                {paginas.map(num => (
                    <button
                        key={num}
                        className={`btn-numero ${pagina === num ? 'activa' : ''}`}
                        onClick={() => onPaginaChange(num)}
                    >
                        {num}
                    </button>
                ))}

                {pagina < totalPaginas - rango && (
                    <>
                        <span className="ellipsis">...</span>
                        <button onClick={() => onPaginaChange(totalPaginas)}>
                            {totalPaginas}
                        </button>
                    </>
                )}
            </div>

            {/* Flecha Derecha */}
            <button 
                className="btn-flecha btn-flecha-derecha"
                onClick={handleSiguiente}
                disabled={pagina === totalPaginas}
                title="Página siguiente"
            >
                <span className="flecha-icon">❯</span>
            </button>
        </div>
    );
};

export default Pagination;
