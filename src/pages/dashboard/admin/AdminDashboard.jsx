import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Briefcase,
  Building2,
  DollarSign,
  FileText,
  LayoutGrid,
  Receipt,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AuthContext } from "../../../context/AuthContext";
import { Header } from "../../../components/Layout/Header";
import { useDashboardStats } from "../../../shared/hooks/useDashboardStats";
import { getModulesByRole } from "../../../utils/roleUtils";

const MOTION_EASE = [0.22, 1, 0.36, 1];

const MotionSection = motion.section;
const MotionArticle = motion.article;
const MotionDiv = motion.div;
const MotionButton = motion.button;

const topStatsConfig = [
  {
    key: "usuarios",
    label: "Usuarios",
    icon: Users,
    iconColor: "text-slate-300",
    valueColor: "text-slate-100",
  },
  {
    key: "clientes",
    label: "Clientes",
    icon: Briefcase,
    iconColor: "text-sky-300",
    valueColor: "text-slate-100",
  },
  {
    key: "proveedores",
    label: "Proveedores",
    icon: Building2,
    iconColor: "text-amber-300",
    valueColor: "text-slate-100",
  },
  {
    key: "facturas",
    label: "Facturas",
    icon: FileText,
    iconColor: "text-violet-300",
    valueColor: "text-slate-100",
  },
  {
    key: "cobros",
    label: "Cobros",
    icon: DollarSign,
    iconColor: "text-emerald-300",
    valueColor: "text-slate-100",
  },
  {
    key: "pagos",
    label: "Pagos",
    icon: Wallet,
    iconColor: "text-cyan-300",
    valueColor: "text-slate-100",
  },
];

const moduleMetaByPath = {
  "/usuarios": {
    icon: UserCog,
    description: "Controla cuentas, roles y permisos de acceso.",
  },
  "/clientes": {
    icon: Users,
    description: "Gestiona cartera comercial y estados de cuenta.",
  },
  "/proveedores": {
    icon: Building2,
    description: "Administra relacion con proveedores y operaciones.",
  },
  "/facturas-cobrar": {
    icon: FileText,
    description: "Consulta facturas emitidas y su seguimiento.",
  },
  "/facturas-pagar": {
    icon: Receipt,
    description: "Monitorea compromisos por pagar y vencimientos.",
  },
  "/cobros": {
    icon: DollarSign,
    description: "Registra y controla ingresos por cobranzas.",
  },
  "/pagos": {
    icon: Wallet,
    description: "Gestiona pagos a proveedores y salidas.",
  },
  "/reportes": {
    icon: BarChart3,
    description: "Visualiza indicadores ejecutivos y analitica.",
  },
  "/auditoria": {
    icon: ShieldCheck,
    description: "Revisa historial de acciones y trazabilidad.",
  },
  "/ia": {
    icon: Sparkles,
    description: "Obtiene analisis inteligentes para decisiones.",
  },
};

export const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const modules = getModulesByRole(user?.rol);
  const { stats, loading, error } = useDashboardStats(user?.rol);

  const animationProps = (delay = 0) => {
    if (reduceMotion) {
      return {
        transition: { duration: 0 },
      };
    }

    return {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.28,
        delay,
        ease: MOTION_EASE,
      },
    };
  };

  const statsMapped = useMemo(
    () =>
      topStatsConfig.map((item) => ({
        ...item,
        value: Number(stats[item.key] || 0),
      })),
    [stats]
  );

  const modulesMapped = useMemo(
    () =>
      modules.map((moduleItem) => {
        const moduleMeta = moduleMetaByPath[moduleItem.path] || {
          icon: LayoutGrid,
          description: "Accede a este modulo y gestiona informacion clave.",
        };

        return {
          ...moduleItem,
          icon: moduleMeta.icon,
          description: moduleMeta.description,
        };
      }),
    [modules]
  );

  const dashboardTotals = useMemo(() => {
    const totalRegistros =
      Number(stats.usuarios || 0) +
      Number(stats.clientes || 0) +
      Number(stats.proveedores || 0) +
      Number(stats.facturas || 0) +
      Number(stats.cobros || 0) +
      Number(stats.pagos || 0);

    const transacciones = Number(stats.cobros || 0) + Number(stats.pagos || 0);
    const documentos = Number(stats.facturas || 0);

    return {
      totalRegistros,
      transacciones,
      documentos,
    };
  }, [stats]);

  const chartData = useMemo(
    () => [
      {
        periodo: "Mes Actual",
        cobros: Number(stats.cobros || 0),
        pagos: Number(stats.pagos || 0),
      },
    ],
    [stats]
  );

  const summaryCards = [
    {
      label: "Total de Registros",
      value: dashboardTotals.totalRegistros,
      icon: LayoutGrid,
      color: "text-violet-300",
    },
    {
      label: "Transacciones",
      value: dashboardTotals.transacciones,
      icon: BarChart3,
      color: "text-emerald-300",
    },
    {
      label: "Documentos",
      value: dashboardTotals.documentos,
      icon: Receipt,
      color: "text-cyan-300",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#060b16] px-4 pb-20 pt-6 md:px-8 md:pt-10">
        <MotionSection
          className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-950/70 p-6 shadow-sm md:p-8"
          {...animationProps(0)}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Panel ejecutivo</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-100 md:text-4xl">
            Bienvenido, <span className="text-slate-200">{user?.nombre} {user?.apellido}</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 md:text-base">Sistema de Gestion de Cuentas por Cobrar y Pagar</p>
          {error ? (
            <p className="mt-4 rounded-lg border border-rose-900 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
              No se pudo cargar una parte de los indicadores. Intenta actualizar el panel.
            </p>
          ) : null}
        </MotionSection>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[122px] animate-pulse rounded-xl border border-slate-800 bg-slate-950" />
              ))
            : statsMapped.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <MotionArticle
                    key={stat.key}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm"
                    {...animationProps(0.04 + index * 0.03)}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y: -4,
                            scale: 1.01,
                            borderColor: "rgb(71 85 105)",
                          }
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                        <p className={`mt-2 text-3xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                      </div>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
                        <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                      </span>
                    </div>
                  </MotionArticle>
                );
              })}
        </section>

        <section className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <MotionArticle
            className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm xl:col-span-2"
            {...animationProps(0.18)}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Cobros vs Pagos</h2>
                <p className="text-xs text-slate-400">Comparativo operativo del periodo cargado en dashboard.</p>
              </div>
              <span className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">Vista ejecutiva</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 16, right: 12, left: -12, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="periodo" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(30, 41, 59, 0.25)" }}
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                      color: "#e2e8f0",
                    }}
                    labelStyle={{ color: "#cbd5e1" }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ color: "#cbd5e1", fontSize: "12px", paddingBottom: "12px" }}
                  />
                  <Bar dataKey="cobros" name="Cobros" fill="#34d399" radius={[10, 10, 0, 0]} maxBarSize={70} />
                  <Bar dataKey="pagos" name="Pagos" fill="#38bdf8" radius={[10, 10, 0, 0]} maxBarSize={70} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </MotionArticle>

          <MotionDiv className="grid grid-cols-1 gap-4" {...animationProps(0.22)}>
            {summaryCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <MotionArticle
                  key={card.label}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm"
                  {...animationProps(0.24 + index * 0.03)}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: -3,
                          scale: 1.01,
                          borderColor: "rgb(71 85 105)",
                        }
                  }
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-400">{card.label}</p>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <p className="text-3xl font-bold text-slate-100">{card.value}</p>
                </MotionArticle>
              );
            })}
          </MotionDiv>
        </section>

        <section>
          <MotionDiv className="mb-5" {...animationProps(0.28)}>
            <h2 className="text-2xl font-bold text-slate-100">Modulos Disponibles</h2>
            <p className="mt-1 text-sm text-slate-400">Accesos directos con navegacion tipo bento para mayor productividad.</p>
          </MotionDiv>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modulesMapped.map((moduleItem, index) => {
              const Icon = moduleItem.icon;

              return (
                <MotionButton
                  key={moduleItem.path}
                  onClick={() => navigate(moduleItem.path)}
                  className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 p-5 text-left shadow-sm"
                  {...animationProps(0.3 + index * 0.02)}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: -4,
                          scale: 1.015,
                          borderColor: "rgb(100 116 139)",
                        }
                  }
                >
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-900/0 via-slate-800/0 to-slate-700/0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div>
                      <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-base font-semibold text-slate-100">{moduleItem.label}</h3>
                      <p className="mt-1 text-sm text-slate-400">{moduleItem.description}</p>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-200" />
                  </div>
                </MotionButton>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
};
