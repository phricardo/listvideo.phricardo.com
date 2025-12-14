import React from "react";
import styles from "./Catalog.module.css";
import IconPicker, {
  renderIcon,
  FALLBACK_ICON_KEY,
  normalizeIconKey,
} from "./IconPicker";
import {
  SAVED_COURSE_SAVE,
  SAVED_COURSE_UPDATE,
  SAVED_COURSE_DELETE,
} from "../../Api";
import { safeParseJson, toastApiError, toastApiSuccess } from "../../utils/apiErrors";
import { LanguageContext } from "../../Context/LanguageContext";

const DEFAULT_CATEGORY = "general";
const CATEGORY_OPTIONS = [
  "frontend",
  "backend",
  "fullstack",
  "data",
  "devops",
  "mobile",
  "security",
  "ai",
  "uiux",
  "matematica",
  "portugues",
  "ciencias_natureza",
  "ciencias_humanas",
  "redacao",
  "engenharia",
  "saude",
  "direito",
  "negocios",
  "educacao",
  "general",
];

const CATEGORY_LABELS = {
  pt: {
    frontend: "Front-end",
    backend: "Back-end",
    fullstack: "Full-stack",
    data: "Dados",
    devops: "DevOps",
    mobile: "Mobile",
    security: "Segurança",
    ai: "IA",
    uiux: "UI/UX",
    matematica: "Matemática",
    portugues: "Português",
    ciencias_natureza: "Ciências da Natureza",
    ciencias_humanas: "Ciências Humanas",
    redacao: "Redação",
    engenharia: "Engenharia",
    saude: "Saúde",
    direito: "Direito",
    negocios: "Negócios",
    educacao: "Educação",
    general: "Geral",
  },
  en: {
    frontend: "Frontend",
    backend: "Backend",
    fullstack: "Fullstack",
    data: "Data",
    devops: "DevOps",
    mobile: "Mobile",
    security: "Security",
    ai: "AI",
    uiux: "UI/UX",
    matematica: "Math",
    portugues: "Portuguese",
    ciencias_natureza: "Natural Sciences",
    ciencias_humanas: "Human Sciences",
    redacao: "Writing",
    engenharia: "Engineering",
    saude: "Health",
    direito: "Law",
    negocios: "Business",
    educacao: "Education",
    general: "General",
  },
};

const resolveCategoryLabel = (category, language) => {
  const labels = CATEGORY_LABELS[language] || CATEGORY_LABELS.en;
  return labels[category] || category;
};

const AddToCatalogModal = ({ open, onClose, course, savedCourse }) => {
  const isEditing = Boolean(savedCourse?.id);
  const { language } = React.useContext(LanguageContext);
  const [customTitle, setCustomTitle] = React.useState(course?.title || "");
  const [category, setCategory] = React.useState(
    savedCourse?.category || DEFAULT_CATEGORY
  );
  const [iconKey, setIconKey] = React.useState(
    normalizeIconKey(savedCourse?.iconKey || FALLBACK_ICON_KEY)
  );
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setCustomTitle(savedCourse?.customTitle || course?.title || "");
    setCategory(savedCourse?.category || DEFAULT_CATEGORY);
    setIconKey(normalizeIconKey(savedCourse?.iconKey || FALLBACK_ICON_KEY));
  }, [
    open,
    savedCourse?.id,
    savedCourse?.customTitle,
    savedCourse?.category,
    savedCourse?.iconKey,
    course?.playlistId,
    course?.title,
  ]);

  if (!open) return null;

  const playlistId = savedCourse?.youtubePlaylistId || course?.playlistId;
  const channelId = savedCourse?.authorChannelId || course?.channelId;
  const channelTitle = savedCourse?.authorChannelTitle || course?.channelTitle;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        youtubePlaylistId: playlistId,
        youtubeChannelId: channelId,
        youtubeChannelTitle: channelTitle,
        customTitle,
        category,
        iconKey: normalizeIconKey(iconKey),
      };

      const { url, options } = isEditing
        ? SAVED_COURSE_UPDATE(savedCourse.id, {
            customTitle,
            category,
            iconKey: normalizeIconKey(iconKey),
          })
        : SAVED_COURSE_SAVE(payload);

      const response = await fetch(url, options);
      if (!response.ok) {
        const payloadError = await safeParseJson(response);
        throw payloadError || new Error("Erro ao salvar curso.");
      }
      toastApiSuccess(isEditing ? "Curso atualizado" : "Curso salvo no catálogo");
      onClose(true);
    } catch (err) {
      toastApiError(err, "Não foi possível salvar o curso.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    setIsLoading(true);
    try {
      const { url, options } = SAVED_COURSE_DELETE(savedCourse.id);
      const response = await fetch(url, options);
      if (!response.ok) {
        const payloadError = await safeParseJson(response);
        throw payloadError || new Error("Erro ao remover curso.");
      }
      toastApiSuccess("Curso removido do catálogo");
      onClose(true);
    } catch (err) {
      toastApiError(err, "Não foi possível remover o curso.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.catalogModalOverlay}>
      <div className={styles.catalogModalCard}>
        <header className={styles.catalogModalHeader}>
          <div className={styles.catalogModalTitle}>
            {isEditing ? "Editar curso" : "Adicionar ao meu catálogo"}
          </div>
          <button className={styles.catalogClose} onClick={() => onClose(false)} aria-label="Fechar">
            ×
          </button>
        </header>

        <div className={styles.catalogPreview}>
          <div className={styles.catalogCardIcon}>
            {renderIcon(normalizeIconKey(iconKey), 36)}
          </div>
          <div>
            <div className={styles.catalogCardTitle}>{customTitle || "Sem título"}</div>
            <div className={styles.catalogModalMeta}>Autor: {channelTitle || "Desconhecido"}</div>
          </div>
        </div>

        <div className={styles.catalogField}>
          <label htmlFor="customTitle">Título no meu catálogo</label>
          <input
            id="customTitle"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            maxLength={255}
            placeholder="Digite um título"
          />
        </div>

        <div className={styles.catalogField}>
          <label htmlFor="category">Categoria</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {resolveCategoryLabel(option, language)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.catalogField}>
          <label>Ícone</label>
          <IconPicker value={iconKey} onChange={setIconKey} />
        </div>

        <div className={styles.catalogModalMeta}>Autor: {channelTitle || "Desconhecido"}</div>

        <div className={styles.catalogModalActions}>
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className={styles.catalogDangerBtn}
              disabled={isLoading}
            >
              Remover
            </button>
          )}
          <button
            type="button"
            className={styles.catalogGhostBtn}
            onClick={() => onClose(false)}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.catalogPrimaryBtn}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCatalogModal;
