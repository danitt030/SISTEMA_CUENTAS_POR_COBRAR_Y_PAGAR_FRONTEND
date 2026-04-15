
const Pagination = ({ pagina, totalPaginas, onPaginaChange }) => {
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
    const rango = 2;

    for (let i = Math.max(1, pagina - rango); i <= Math.min(totalPaginas, pagina + rango); i++) {
        paginas.push(i);
    }

    return (
        <nav className="pagination-container pagination-pro" aria-label="Paginacion">
            <button
                className="btn-flecha"
                onClick={() => onPaginaChange(1)}
                disabled={pagina === 1}
                title="Primera pagina"
                aria-label="Ir a la primera pagina"
            >
                <span className="flecha-icon">«</span>
            </button>

            <button
                className="btn-flecha"
                onClick={handleAnterior}
                disabled={pagina === 1}
                title="Pagina anterior"
                aria-label="Ir a la pagina anterior"
            >
                <span className="flecha-icon">❮</span>
            </button>

            <div className="pagination-center-panel">
                <span className="pagination-info">
                    Pagina <strong>{pagina}</strong> de <strong>{totalPaginas}</strong>
                </span>

                <div className="pagination-numeros">
                    {pagina > 1 + rango && (
                        <>
                            <button className="btn-numero" onClick={() => onPaginaChange(1)}>1</button>
                            <span className="ellipsis">...</span>
                        </>
                    )}

                    {paginas.map((num) => (
                        <button
                            key={num}
                            className={`btn-numero ${pagina === num ? "activa" : ""}`}
                            onClick={() => onPaginaChange(num)}
                            aria-current={pagina === num ? "page" : undefined}
                        >
                            {num}
                        </button>
                    ))}

                    {pagina < totalPaginas - rango && (
                        <>
                            <span className="ellipsis">...</span>
                            <button className="btn-numero" onClick={() => onPaginaChange(totalPaginas)}>
                                {totalPaginas}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <button
                className="btn-flecha"
                onClick={handleSiguiente}
                disabled={pagina === totalPaginas}
                title="Pagina siguiente"
                aria-label="Ir a la pagina siguiente"
            >
                <span className="flecha-icon">❯</span>
            </button>

            <button
                className="btn-flecha"
                onClick={() => onPaginaChange(totalPaginas)}
                disabled={pagina === totalPaginas}
                title="Ultima pagina"
                aria-label="Ir a la ultima pagina"
            >
                <span className="flecha-icon">»</span>
            </button>
        </nav>
    );
};

export default Pagination;
