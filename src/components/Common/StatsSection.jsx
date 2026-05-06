import { motion, useReducedMotion } from "framer-motion";

const MotionSection = motion.section;
const MotionArticle = motion.article;

export const StatsSection = ({ stats = [], loading = false, title = "Estadisticas rapidas" }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="stats-section-root">
      <h3 className="stats-section-title">
        {title} {loading && <span className="stats-section-loading">(cargando...)</span>}
      </h3>

      <MotionSection
        className="module-stats-grid"
        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {stats.map((stat, idx) => (
          <MotionArticle
            key={`${stat?.label || "stat"}-${idx}`}
            className="module-stat-card stats-section-card"
            style={stat?.color ? { "--module-stat-accent": stat.color } : undefined}
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.2,
              delay: reduceMotion ? 0 : Math.min(idx * 0.03, 0.16),
            }}
          >
            <p className="module-stat-label">
              <span className="module-stat-dot" aria-hidden="true" />
              {stat?.label}
            </p>
            <p className="module-stat-value">{stat?.value}</p>
          </MotionArticle>
        ))}
      </MotionSection>
    </div>
  );
};
