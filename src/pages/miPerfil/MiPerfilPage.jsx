import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MiPerfil } from "../../components/MiPerfil/MiPerfil";
import { Header } from "../../components/Layout/Header";

export const MiPerfilPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-72px)] bg-[#060b16] pb-10">
        <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 shadow-sm transition hover:border-slate-600 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        </div>
        <MiPerfil />
      </main>
    </>
  );
};
