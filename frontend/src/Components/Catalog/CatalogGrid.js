import React from "react";
import styles from "./Catalog.module.css";
import { renderIcon, normalizeIconKey } from "./IconPicker";

const APP_BASE_URL =
  process.env.REACT_APP_FRONTEND_URL || (typeof window !== "undefined" ? window.location.origin : "");

const CatalogGrid = ({ courses, isOwner, onEdit, categoryLabelResolver }) => {
  if (!courses?.length) {
    return (
      <div className={styles.catalogEmpty}>
        <div className={styles.catalogEmptyTitle}>Aqui aparecerão os cursos salvos pelo usuário.</div>
        <p className={styles.catalogEmptySubtitle}>
          Nada por aqui ainda. Quando o catálogo tiver cursos salvos, eles ficam listados neste espaço.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.catalogGrid}>
      {courses.map((course) => (
        <div className={styles.catalogCard} key={course.id}>
          <div className={styles.catalogCardIcon}>
            {renderIcon(normalizeIconKey(course.iconKey), 32)}
          </div>
          <div className={styles.catalogCardTitle}>{course.customTitle}</div>
          <div className={styles.catalogCardMeta}>{course.authorChannelTitle}</div>
          <span className={styles.catalogBadge}>
            {categoryLabelResolver ? categoryLabelResolver(course.category) : course.category}
          </span>
          <div className={styles.catalogCardActions}>
            <a className={styles.catalogLink} href={`${APP_BASE_URL}/playlist/${course.youtubePlaylistId}`}>
              Abrir curso
            </a>
            {isOwner && (
              <button
                type="button"
                className={styles.catalogEditBtn}
                onClick={() => onEdit(course)}
              >
                Editar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CatalogGrid;
