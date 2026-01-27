import React from "react";
import { Icon } from "@iconify/react";
import styles from "./Catalog.module.css";

export const ICON_KEYS = [
  "mdi:book-open-variant",
  "mdi:code-tags",
  "mdi:graduation-cap",
  "mdi:brain",
  "mdi:rocket-outline",
  "mdi:console",
  "mdi:database",
  "mdi:shield-check",
  "mdi:cpu-64-bit",
  "mdi:earth",
  "mdi:file-document-outline",
  "mdi:video-outline",
  "mdi:layers-outline",
  "mdi:folder-outline",
  "mdi:cloud-outline",
  "mdi:camera-outline",
  "mdi:compass-outline",
  "mdi:lightning-bolt-outline",
  "mdi:gift-outline",
  "mdi:key-variant",
  "mdi:lightbulb-on-outline",
  "mdi:map-outline",
  "mdi:monitor",
  "mdi:music",
  "mdi:calculator-variant",
  "mdi:function-variant",
  "mdi:alpha",
  "mdi:alphabet-latin",
  "mdi:leaf",
  "mdi:atom",
  "mdi:scale-balance",
  "mdi:human-male-board",
  "mdi:book-education-outline",
  "mdi:school-outline",
  "mdi:stethoscope",
  "mdi:gavel",
  "mdi:briefcase-outline",
  "mdi:city-variant-outline",
];

export const FALLBACK_ICON_KEY = "mdi:book-open-variant";

const LEGACY_ICON_MAP = {
  BookOpen: "mdi:book-open-variant",
  Code: "mdi:code-tags",
  GraduationCap: "mdi:graduation-cap",
  Brain: "mdi:brain",
  Rocket: "mdi:rocket-outline",
  Terminal: "mdi:console",
  Database: "mdi:database",
  Shield: "mdi:shield-check",
  Cpu: "mdi:cpu-64-bit",
  Globe: "mdi:earth",
  FileText: "mdi:file-document-outline",
  Video: "mdi:video-outline",
  Layers: "mdi:layers-outline",
  Folder: "mdi:folder-outline",
  Cloud: "mdi:cloud-outline",
  Camera: "mdi:camera-outline",
  Compass: "mdi:compass-outline",
  Flame: "mdi:lightning-bolt-outline",
  Gift: "mdi:gift-outline",
  Key: "mdi:key-variant",
  Lightbulb: "mdi:lightbulb-on-outline",
  Map: "mdi:map-outline",
  Monitor: "mdi:monitor",
  Music: "mdi:music",
  Calculator: "mdi:calculator-variant",
  Function: "mdi:function-variant",
  Alpha: "mdi:alpha",
  Alphabet: "mdi:alphabet-latin",
  Leaf: "mdi:leaf",
  Atom: "mdi:atom",
  Scales: "mdi:scale-balance",
  Teacher: "mdi:human-male-board",
  Education: "mdi:book-education-outline",
  School: "mdi:school-outline",
  Stethoscope: "mdi:stethoscope",
  Gavel: "mdi:gavel",
  Briefcase: "mdi:briefcase-outline",
  City: "mdi:city-variant-outline",
};

export const normalizeIconKey = (iconKey) => {
  if (ICON_KEYS.includes(iconKey)) return iconKey;
  const mapped = LEGACY_ICON_MAP[iconKey];
  return mapped || FALLBACK_ICON_KEY;
};

export const renderIcon = (iconKey, size = 32) => {
  const normalized = normalizeIconKey(iconKey);
  return (
    <Icon
      icon={normalized}
      width={size}
      height={size}
      color="currentColor"
      className={styles.iconPickerIcon}
    />
  );
};

const IconPicker = ({ value, onChange }) => {
  const [query, setQuery] = React.useState("");

  const filtered = ICON_KEYS.filter((key) =>
    key.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className={styles.iconPicker}>
      <input
        className={styles.iconPickerSearch}
        type="text"
        placeholder="Buscar ícone"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className={styles.iconPickerGrid}>
        {filtered.map((key) => (
          <button
            type="button"
            key={key}
            className={`${styles.iconPickerItem} ${
              key === value ? styles.iconPickerItemActive : ""
            }`}
            onClick={() => onChange(key)}
          >
            <Icon icon={key} width={22} height={22} color="currentColor" />
            <span>{key.replace("mdi:", "")}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconPicker;
