import { useNavigate } from "react-router-dom";
import { MiPerfil } from "../../components/MiPerfil/MiPerfil";
import { Header } from "../../components/Layout/Header";

export const MiPerfilPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-[#08142b] via-[#0b1e43] to-[#13326a] pb-10">
        <div className="pointer-events-none absolute -left-32 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center rounded-xl border border-blue-200/40 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-50 shadow-sm backdrop-blur transition hover:bg-white/20"
          >
            ← Volver
          </button>
        </div>
        <MiPerfil />
      </main>
    </>
  );
};
