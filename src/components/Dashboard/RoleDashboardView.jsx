import { useMemo } from "react";
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

const MOTION_EASE = [0.22, 1, 0.36, 1];

const MotionSection = motion.section;
const MotionArticle = motion.article;
const MotionDiv = motion.div;
const MotionButton = motion.button;

const metricMetaByKey = {
  usuarios: {
    label: "Usuarios",
    icon: Users,
    iconColor: "text-slate-300",
    chartColor: "#cbd5e1",
  },
  clientes: {
    label: "Clientes",
    icon: Briefcase,
    iconColor: "text-sky-300",
    chartColor: "#38bdf8",
  },
  proveedores: {
    label: "Proveedores",
    icon: Building2,
    iconColor: "text-amber-300",
    chartColor: "#fbbf24",
  },
  facturas: {
    label: "Facturas",
    icon: FileText,
    iconColor: "text-violet-300",
    chartColor: "#a78bfa",
  },
  cobros: {
    label: "Cobros",
    icon: DollarSign,
    iconColor: "text-emerald-300",
    chartColor: "#34d399",
  },
  pagos: {
    label: "Pagos",
    icon: Wallet,
    iconColor: "text-cyan-300",
    chartColor: "#38bdf8",
  },
};

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
  "/cliente-portal": {
    icon: LayoutGrid,
    description: "Accede a tus facturas, cobros y estado actual.",
  },
};

const toCount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const RoleDashboardView = ({
  title,
  greeting,
  subtitle,
  modules = [],
  stats,
  loading,
  error,
  metricKeys = [],
  chartTitle = "Rendimiento Operativo",
  chartDescription = "Resumen del periodo actual para los indicadores visibles.",
  chartKeys = [],
  modulesTitle = "Modulos Disponibles",
  modulesDescription = "Accesos directos disponibles segun tus permisos.",
  chartBadge = "Vista operativa",
  onNavigate,
}) => {
  const reduceMotion = useReducedMotion();

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

  const metrics = useMemo(
    () =>
      metricKeys
        .map((key) => {
          const meta = metricMetaByKey[key];
          if (!meta) {
            return null;
          }

          return {
            key,
            label: meta.label,
            icon: meta.icon,
            iconColor: meta.iconColor,
            value: toCount(stats?.[key]),
          };
        })
        .filter(Boolean),
    [metricKeys, stats]
  );

  const chartSeries = useMemo(
    () =>
      chartKeys
        .map((key) => {
          const meta = metricMetaByKey[key];
          if (!meta) {
            return null;
          }

          return {
            key,
            label: meta.label,
            color: meta.chartColor,
          };
        })
        .filter(Boolean),
    [chartKeys]
  );

  const chartData = useMemo(() => {
    if (!chartSeries.length) {
      return [];
    }

    const basePoint = chartSeries.reduce(
      (accumulator, seriesItem) => {
        accumulator[seriesItem.key] = toCount(stats?.[seriesItem.key]);
        return accumulator;
      },
      { periodo: "Periodo actual" }
    );

    return [basePoint];
  }, [chartSeries, stats]);

  const modulesMapped = useMemo(
    () =>
      modules.map((moduleItem) => {
        const meta = moduleMetaByPath[moduleItem.path] || {
          icon: LayoutGrid,
          description: "Accede a este modulo para gestionar informacion clave.",
        };

        return {
          ...moduleItem,
          icon: meta.icon,
          description: meta.description,
        };
      }),
    [modules]
  );

  const summaryCards = useMemo(() => {
    const visibleTotal = metrics.reduce((accumulator, item) => accumulator + item.value, 0);
    const activityTotal = chartSeries.reduce(
      (accumulator, seriesItem) => accumulator + toCount(stats?.[seriesItem.key]),
      0
    );

    return [
      {
        label: "Total visible",
        value: visibleTotal,
        icon: LayoutGrid,
        iconColor: "text-violet-300",
      },
      {
        label: "Modulos habilitados",
        value: modulesMapped.length,
        icon: ShieldCheck,
        iconColor: "text-emerald-300",
      },
      {
        label: "Actividad clave",
        value: activityTotal,
        icon: BarChart3,
        iconColor: "text-cyan-300",
      },
    ];
  }, [metrics, modulesMapped.length, chartSeries, stats]);

  return (
    <div className="min-h-screen bg-[#060b16] px-4 pb-20 pt-6 md:px-8 md:pt-10">
      <MotionSection
        className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-950/70 p-6 shadow-sm md:p-8"
        {...animationProps(0)}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Panel operativo</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-100 md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm font-medium text-slate-300 md:text-base">{greeting}</p>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        {error ? (
          <p className="mt-4 rounded-lg border border-rose-900 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
            Algunos indicadores no pudieron cargarse con tus permisos actuales.
          </p>
        ) : null}
      </MotionSection>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: Math.max(metrics.length, 3) }).map((_, index) => (
              <div key={index} className="h-[122px] animate-pulse rounded-xl border border-slate-800 bg-slate-950" />
            ))
          : metrics.map((item, index) => {
              const Icon = item.icon;

              return (
                <MotionArticle
                  key={item.key}
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
                      <p className="text-sm font-medium text-slate-400">{item.label}</p>
                      <p className="mt-2 text-3xl font-bold text-slate-100">{item.value}</p>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
                      <Icon className={`h-5 w-5 ${item.iconColor}`} />
                    </span>
                  </div>
                </MotionArticle>
              );
            })}
      </section>

      <section className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <MotionArticle
          className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm xl:col-span-2"
          {...animationProps(0.16)}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">{chartTitle}</h2>
              <p className="text-xs text-slate-400">{chartDescription}</p>
            </div>
            <span
              className="cursor-default select-none rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300"
              aria-label="Etiqueta de contexto"
            >
              {chartBadge}
            </span>
          </div>

          <div className="h-72 w-full">
            {chartSeries.length ? (
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
                  {chartSeries.map((seriesItem) => (
                    <Bar
                      key={seriesItem.key}
                      dataKey={seriesItem.key}
                      name={seriesItem.label}
                      fill={seriesItem.color}
                      radius={[10, 10, 0, 0]}
                      maxBarSize={chartSeries.length === 1 ? 120 : 70}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center rounded-xl border border-dashed border-slate-700 bg-slate-900/40 text-sm text-slate-400">
                No hay series disponibles para este rol.
              </div>
            )}
          </div>
        </MotionArticle>

        <MotionDiv className="grid grid-cols-1 gap-4" {...animationProps(0.2)}>
          {summaryCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <MotionArticle
                key={card.label}
                className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm"
                {...animationProps(0.22 + index * 0.03)}
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
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <p className="text-3xl font-bold text-slate-100">{card.value}</p>
              </MotionArticle>
            );
          })}
        </MotionDiv>
      </section>

      <section>
        <MotionDiv className="mb-5" {...animationProps(0.26)}>
          <h2 className="text-2xl font-bold text-slate-100">{modulesTitle}</h2>
          <p className="mt-1 text-sm text-slate-400">{modulesDescription}</p>
        </MotionDiv>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modulesMapped.map((moduleItem, index) => {
            const Icon = moduleItem.icon;

            return (
              <MotionButton
                key={moduleItem.path}
                onClick={() => onNavigate(moduleItem.path)}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 p-5 text-left shadow-sm"
                {...animationProps(0.28 + index * 0.02)}
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
  );
};
