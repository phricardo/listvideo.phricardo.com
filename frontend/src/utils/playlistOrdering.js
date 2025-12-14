const YT_PLAYLIST_URL = "https://www.googleapis.com/youtube/v3/playlistItems";
const DEFAULT_MAX_PER_PAGE = 50;
const PARSE_CACHE = new Map();
const ROMAN_PATTERN =
  /^(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))$/i;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch (_err) {
    return null;
  }
};

const buildErrorMessage = (status, payload) => {
  const reason = payload?.error?.errors?.[0]?.reason;
  const message = payload?.error?.message;

  if (reason === "quotaExceeded" || reason === "dailyLimitExceeded") {
    return "YouTube API quota exceeded. Try again later.";
  }
  if (reason === "rateLimitExceeded" || status === 429) {
    return "YouTube API rate limit reached. Slow down and retry.";
  }
  if (reason === "keyInvalid") {
    return "Invalid or unauthorized API key.";
  }
  if (reason === "playlistItemsNotAccessible" || reason === "playlistNotFound") {
    return "Playlist not accessible with provided key.";
  }
  if (reason === "forbidden" || status === 403) {
    return "Access forbidden. Check API key permissions.";
  }

  if (message) return `${message} (HTTP ${status})`;
  return `Request failed (HTTP ${status})`;
};

const fetchPlaylistPage = async ({
  apiKey,
  playlistId,
  maxResults,
  pageToken,
  signal,
}) => {
  const params = new URLSearchParams({
    key: apiKey,
    part: "snippet",
    maxResults: String(maxResults),
    playlistId,
    fields:
      "items(id,snippet(title,position,resourceId/videoId)),nextPageToken,pageInfo/totalResults",
  });
  if (pageToken) params.set("pageToken", pageToken);

  const url = `${YT_PLAYLIST_URL}?${params.toString()}`;
  const response = await fetch(url, { method: "GET", signal });
  const payload = await safeJson(response);

  if (!response.ok) {
    throw new Error(buildErrorMessage(response.status, payload));
  }

  return payload || {};
};

export const fetchAllPlaylistItems = async ({
  apiKey,
  playlistId,
  maxPerPage = DEFAULT_MAX_PER_PAGE,
  signal,
  throttleMs = 0,
}) => {
  if (!apiKey) throw new Error("apiKey is required");
  if (!playlistId) throw new Error("playlistId is required");

  const maxResults = clamp(Number(maxPerPage) || DEFAULT_MAX_PER_PAGE, 1, 50);
  const items = [];
  let nextPageToken;

  do {
    const page = await fetchPlaylistPage({
      apiKey,
      playlistId,
      maxResults,
      pageToken: nextPageToken,
      signal,
    });

    if (Array.isArray(page.items)) {
      items.push(...page.items);
    }

    nextPageToken = page.nextPageToken;
    if (nextPageToken && throttleMs) {
      await sleep(throttleMs);
    }
  } while (nextPageToken);

  return items;
};

const romanToInt = (roman) => {
  if (!roman || !ROMAN_PATTERN.test(roman)) return null;
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let prev = 0;

  for (let i = roman.length - 1; i >= 0; i -= 1) {
    const current = map[roman[i].toUpperCase()] || 0;
    if (current < prev) total -= current;
    else total += current;
    prev = current;
  }

  if (total <= 0) return null;
  return total;
};

const parseIntegerToken = (token) => {
  const normalized = (token || "").trim();
  if (!normalized) return null;
  if (/^\d+$/.test(normalized)) return parseInt(normalized, 10);

  const romanValue = romanToInt(normalized.toUpperCase());
  return Number.isFinite(romanValue) ? romanValue : null;
};

const parseLessonToken = (token) => {
  const normalized = (token || "").trim();
  if (!normalized) return { major: null, minor: null };

  if (/^\d+(?:\.\d+)?$/.test(normalized)) {
    const [majorStr, minorStr] = normalized.split(".");
    return {
      major: parseInt(majorStr, 10),
      minor: minorStr ? parseInt(minorStr, 10) : null,
    };
  }

  const romanValue = romanToInt(normalized.toUpperCase());
  return { major: Number.isFinite(romanValue) ? romanValue : null, minor: null };
};

const cleanTitle = (title) =>
  (title || "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

const extractChapter = (title) => {
  const normalized = cleanTitle(title);
  const patterns = [
    /\b(?:cap(?:itulo|\u00edtulo)?|cap\.?|cap|chapter|ch)\s*\.?\s*([0-9]{1,4}|[ivxlcdm]+)\b/i,
    /\bC\s*\.?\s*([0-9]{1,4}|[ivxlcdm]+)\b/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) {
      const chapter = parseIntegerToken(match[1]);
      if (Number.isFinite(chapter)) return chapter;
    }
  }
  return null;
};

const extractLesson = (title) => {
  const normalized = cleanTitle(title);
  const patterns = [
    /\b(?:aula|lesson|lsn|l)\s*\.?\s*([0-9]+(?:\.[0-9]+)?|[ivxlcdm]+)\b/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) {
      const lesson = parseLessonToken(match[1]);
      if (Number.isFinite(lesson.major)) return lesson;
    }
  }
  return { major: null, minor: null };
};

export const parseOrderingFromTitle = (title) => {
  const chapter = extractChapter(title);
  const lesson = extractLesson(title);
  const hasChapter = Number.isFinite(chapter);
  const hasLesson = Number.isFinite(lesson.major);

  return {
    chapter: hasChapter ? chapter : null,
    lessonMajor: hasLesson ? lesson.major : null,
    lessonMinor: hasLesson ? lesson.minor : null,
    hasChapter,
    hasLesson,
  };
};

export const parseOrderingFromTitleCached = (title) => {
  const key = title || "";
  if (PARSE_CACHE.has(key)) {
    const cached = PARSE_CACHE.get(key);
    return { ...cached };
  }
  const parsed = parseOrderingFromTitle(key);
  PARSE_CACHE.set(key, parsed);
  return { ...parsed };
};

const compareNullableNumber = (a, b) => {
  if (Number.isFinite(a) && Number.isFinite(b)) return a - b;
  if (Number.isFinite(a)) return -1;
  if (Number.isFinite(b)) return 1;
  return 0;
};

export const suggestedSort = (items) => {
  const list = [...items];

  list.sort((a, b) => {
    const aHas = a.hasChapter || a.hasLesson;
    const bHas = b.hasChapter || b.hasLesson;
    if (aHas !== bHas) return aHas ? -1 : 1;

    const chapterCmp = compareNullableNumber(a.chapter, b.chapter);
    if (chapterCmp !== 0) return chapterCmp;

    const lessonMajorCmp = compareNullableNumber(a.lessonMajor, b.lessonMajor);
    if (lessonMajorCmp !== 0) return lessonMajorCmp;

    const aMinor = Number.isFinite(a.lessonMinor) ? a.lessonMinor : 0;
    const bMinor = Number.isFinite(b.lessonMinor) ? b.lessonMinor : 0;
    if (aMinor !== bMinor) return aMinor - bMinor;

    return (a.originalIndex ?? 0) - (b.originalIndex ?? 0);
  });

  return list;
};

export const getSortedPlaylistVideos = async ({
  apiKey,
  playlistId,
  maxPerPage = DEFAULT_MAX_PER_PAGE,
  signal,
  parser = parseOrderingFromTitleCached,
  throttleMs,
}) => {
  const items = await fetchAllPlaylistItems({
    apiKey,
    playlistId,
    maxPerPage,
    signal,
    throttleMs,
  });

  const mapped = items.map((item, index) => {
    const title = item?.snippet?.title || "";
    const parsed = parser(title);
    const videoId = item?.snippet?.resourceId?.videoId || null;

    return {
      videoId,
      title,
      chapter: parsed.chapter,
      lessonMajor: parsed.lessonMajor,
      lessonMinor: parsed.lessonMinor,
      originalIndex: index,
      rawItem: item,
      hasChapter: parsed.hasChapter,
      hasLesson: parsed.hasLesson,
    };
  });

  return suggestedSort(mapped);
};

const defaultRenderItem = (item) => {
  const li = document.createElement("li");
  li.className = "playlist-item";

  const link = document.createElement("a");
  link.textContent = item.title || "Sem titulo";
  link.href = item.videoId
    ? `https://www.youtube.com/watch?v=${item.videoId}`
    : "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const meta = [];
  if (Number.isFinite(item.chapter)) meta.push(`Cap ${item.chapter}`);
  if (Number.isFinite(item.lessonMajor)) {
    const minor =
      Number.isFinite(item.lessonMinor) && item.lessonMinor !== null
        ? `.${item.lessonMinor}`
        : "";
    meta.push(`Aula ${item.lessonMajor}${minor}`);
  }

  if (meta.length) {
    const metaSpan = document.createElement("span");
    metaSpan.className = "playlist-meta";
    metaSpan.textContent = ` (${meta.join(" ")})`;
    link.appendChild(metaSpan);
  }

  li.appendChild(link);
  return li;
};

const renderList = (listEl, items, renderItem) => {
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    fragment.appendChild(renderItem(item));
  }
  listEl.replaceChildren(fragment);
};

export const setupPlaylistSorterUI = async ({
  apiKey,
  playlistId,
  container,
  maxPerPage = DEFAULT_MAX_PER_PAGE,
  renderItem = defaultRenderItem,
  throttleMs,
}) => {
  const root =
    typeof container === "string" ? document.querySelector(container) : container;
  if (!root) throw new Error("Container not found for playlist sorter UI");

  root.innerHTML = "";

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.textContent = "Ordenar (sugerido)";
  toggleButton.className = "playlist-toggle";

  const status = document.createElement("div");
  status.className = "playlist-status";
  status.textContent = "Carregando...";

  const list = document.createElement("ul");
  list.className = "playlist-list";

  root.appendChild(toggleButton);
  root.appendChild(status);
  root.appendChild(list);

  let showingSuggested = false;
  let originalModels = [];
  let suggestedModels = [];

  try {
    const items = await fetchAllPlaylistItems({
      apiKey,
      playlistId,
      maxPerPage,
      throttleMs,
    });

    originalModels = items.map((item, index) => {
      const title = item?.snippet?.title || "";
      const parsed = parseOrderingFromTitleCached(title);
      return {
        videoId: item?.snippet?.resourceId?.videoId || null,
        title,
        chapter: parsed.chapter,
        lessonMajor: parsed.lessonMajor,
        lessonMinor: parsed.lessonMinor,
        originalIndex: index,
        rawItem: item,
        hasChapter: parsed.hasChapter,
        hasLesson: parsed.hasLesson,
      };
    });

    suggestedModels = suggestedSort(originalModels);
    status.textContent = `${originalModels.length} videos`;
    renderList(list, originalModels, renderItem);
  } catch (error) {
    status.textContent = error?.message || "Failed to load playlist";
    return;
  }

  toggleButton.addEventListener("click", () => {
    showingSuggested = !showingSuggested;
    toggleButton.textContent = showingSuggested
      ? "Mostrar ordem original"
      : "Ordenar (sugerido)";
    renderList(list, showingSuggested ? suggestedModels : originalModels, renderItem);
  });
};

export default {
  fetchAllPlaylistItems,
  parseOrderingFromTitle,
  parseOrderingFromTitleCached,
  suggestedSort,
  getSortedPlaylistVideos,
  setupPlaylistSorterUI,
};
