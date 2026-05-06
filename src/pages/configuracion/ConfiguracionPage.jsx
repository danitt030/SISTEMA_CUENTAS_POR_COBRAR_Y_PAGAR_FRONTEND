import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  LayoutGrid,
  MonitorCog,
  Save,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { Header } from "../../components/Layout/Header";
import { AuthContext } from "../../context/AuthContext";
import { getDashboardByRole, getRoleName } from "../../utils/roleUtils";
import {
  applyUiPreferences,
  readUiPreferences,
  saveUiPreferences,
} from "../../utils/uiPreferences";

const preferenceItems = [
  {
    key: "compactMode",
    title: "Vista compacta",
    description: "Reduce espacios internos en tablas y tarjetas para mostrar mas datos.",
  },
  {
    key: "smoothAnimations",
    title: "Animaciones suaves",
    description: "Mantiene transiciones visuales para una experiencia mas fluida.",
  },
  {
    key: "notificationsEnabled",
    title: "Notificaciones activas",
    description: "Permite avisos visuales de acciones y cambios importantes.",
  },
];

const PreferenceToggle = ({ id, title, description, enabled, onToggle }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-100">{title}</p>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        aria-label={`Alternar ${title}`}
        aria-pressed={enabled}
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 ${
          enabled
            ? "border-sky-400/60 bg-sky-500/80"
            : "border-slate-700 bg-slate-800"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
    <p id={id} className="sr-only">
      {enabled ? "Activado" : "Desactivado"}
    </p>
  </div>
);

export const ConfiguracionPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [preferences, setPreferences] = useState(() => readUiPreferences());

  useEffect(() => {
    applyUiPreferences(preferences);
  }, [preferences]);

  const dashboardPath = useMemo(() => getDashboardByRole(user?.rol), [user?.rol]);
  const roleName = useMemo(() => getRoleName(user?.rol), [user?.rol]);

  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    saveUiPreferences(preferences);
    toast.success("Configuracion guardada en este navegador");
  };

  const handleGoToProfile = () => {
    if (!user?.uid) {
      return;
    }

    navigate(`/mi-perfil/${user.uid}`);
  };

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-72px)] bg-[#060b16] px-4 pb-12 pt-6 md:px-8 md:pt-8">
        <div className="mx-auto w-full max-w-5xl">
          <section className="mb-6 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-950/70 p-6 shadow-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Ajustes de cuenta</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-100">Configuracion</h1>
            <p className="mt-2 text-sm text-slate-400">
              Gestiona preferencias visuales y accesos rapidos de tu cuenta.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <article className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-slate-300" />
                <h2 className="text-lg font-semibold text-slate-100">Preferencias de interfaz</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {preferenceItems.map((item) => (
                  <PreferenceToggle
                    key={item.key}
                    id={`pref-${item.key}`}
                    title={item.title}
                    description={item.description}
                    enabled={Boolean(preferences[item.key])}
                    onToggle={() => togglePreference(item.key)}
                  />
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:border-sky-400/50 hover:bg-slate-800"
                >
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </button>
                <p className="self-center text-xs text-slate-400">
                  Los cambios se aplican al instante. Guarda para mantenerlos en este navegador.
                </p>
              </div>
            </article>

            <aside className="space-y-4">
              <article className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <MonitorCog className="h-4 w-4 text-sky-300" />
                  <h3 className="text-sm font-semibold text-slate-100">Cuenta activa</h3>
                </div>
                <p className="truncate text-sm font-semibold text-slate-100">
                  {`${user?.nombre || ""} ${user?.apellido || ""}`.trim() || "Usuario"}
                </p>
                <p className="mt-1 text-xs text-slate-400">{roleName}</p>
              </article>

              <article className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-emerald-300" />
                  <h3 className="text-sm font-semibold text-slate-100">Atajos</h3>
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => navigate(dashboardPath)}
                    className="flex w-full items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Volver al Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleGoToProfile}
                    className="flex w-full items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800"
                  >
                    <UserRound className="h-4 w-4" />
                    Ir a Mi Perfil
                  </button>
                </div>
              </article>

              <article className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-300" />
                  <h3 className="text-sm font-semibold text-slate-100">Recomendacion</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Activa notificaciones para recibir avisos de operaciones importantes del sistema.
                </p>
              </article>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
};
