import { useNavigate } from "react-router-dom";
import { Clientes } from "../../components/Clientes/Clientes";
import { Header } from "../../components/Layout/Header";

export const ClientesPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            ← Volver
          </button>
        </div>
        <Clientes />
      </div>
    </>
  );
};
