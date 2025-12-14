import React from "react";
import Header from "../Header/Header";
import Video from "../Video/Video";
import Footer from "../Footer/Footer";
import PlaylistNavigator from "./PlaylistNavigator";
import ProgessBar from "../Helper/ProgessBar";
import styles from "./Playlist.module.css";
import { useParams } from "react-router-dom";
import { PlaylistContext } from "../../Context/PlaylistContext";
import { PLAYLIST_GET, SAVED_COURSES_ME } from "../../Api";
import { UserContext } from "../../Context/UserContext";
import { Icon } from "@iconify/react";
import { LanguageContext } from "../../Context/LanguageContext";
import lang from "../../lang.json";
import AddToCatalogModal from "../Catalog/AddToCatalogModal";
import { safeParseJson } from "../../utils/apiErrors";

const Playlist = () => {
  const { playlistId } = useParams();
  const {
    setCurrentVideoIndex,
    setCurrentVideo,
    setTotalStorage,
    videos,
    currentVideoIndex,
    currentVideo,
    percentage,
    watchedVideos,
    setPage,
    setPlaylist,
    durationPlaylist,
  } = React.useContext(PlaylistContext);
  const { login, getCertificate, loading } = React.useContext(UserContext);
  const { language } = React.useContext(LanguageContext);
  const [savedCourse, setSavedCourse] = React.useState(null);
  const [catalogOpen, setCatalogOpen] = React.useState(false);
  const [loadingSaved, setLoadingSaved] = React.useState(false);
  const [fetchError, setFetchError] = React.useState(null);

  const buildYoutubeErrorMessage = (status, payload) => {
    const reason = payload?.error?.errors?.[0]?.reason;
    if (
      reason === "quotaExceeded" ||
      reason === "dailyLimitExceeded" ||
      reason === "rateLimitExceeded" ||
      status === 429 ||
      status === 403
    ) {
      return "Temporariamente nossa conexão com o YouTube foi bloqueada por limite de uso nas políticas do Google. Tente novamente em alguns minutos.";
    }
    return "Não foi possível carregar esta playlist no momento. Tente novamente em instantes.";
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const { url, options } = PLAYLIST_GET(playlistId, 10);
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const payload = await safeParseJson(response);
          setFetchError(buildYoutubeErrorMessage(response.status, payload));
          return;
        }
        const data = await response.json();
        setFetchError(null);
        setPage(1);
        setPlaylist(data, playlistId);
      } catch (_err) {
        setFetchError(
          "Não foi possível carregar esta playlist no momento. Tente novamente em instantes."
        );
      }
    };
    fetchData();
  }, [playlistId, setPage, setPlaylist]);

  React.useEffect(() => {
    if (watchedVideos[playlistId])
      setTotalStorage(watchedVideos[playlistId].length);
  }, [watchedVideos, playlistId, setTotalStorage]);

  const fetchSavedCourse = React.useCallback(async () => {
    if (!login) {
      setSavedCourse(null);
      return;
    }
    setLoadingSaved(true);
    try {
      const { url, options } = SAVED_COURSES_ME();
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        const current = data.find(
          (item) => item.youtubePlaylistId === playlistId
        );
        setSavedCourse(current || null);
      }
    } catch (_err) {
      setSavedCourse(null);
    } finally {
      setLoadingSaved(false);
    }
  }, [login, playlistId]);

  React.useEffect(() => {
    fetchSavedCourse();
  }, [fetchSavedCourse]);

  const playlistSnippet = videos?.items?.[0]?.snippet || currentVideo || {};
  const catalogCourse = {
    playlistId,
    title: playlistSnippet.title || currentVideo?.title || "",
    channelId: playlistSnippet.channelId || playlistSnippet.videoOwnerChannelId,
    channelTitle:
      playlistSnippet.channelTitle ||
      playlistSnippet.videoOwnerChannelTitle ||
      "",
  };

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.video}>
            {fetchError && <div className={styles.playlistError}>{fetchError}</div>}
            <Video
              videos={videos}
              currentVideo={currentVideo}
              currentVideoIndex={currentVideoIndex}
              setCurrentVideoIndex={setCurrentVideoIndex}
              setCurrentVideo={setCurrentVideo}
              playlistId={playlistId}
            />
          </div>
          <div className={styles.navigator}>
            <ProgessBar percentage={percentage} completeColorBar="#b1e458" />
            <button
              className={`${styles.certificate_btn} ${
                loading && styles.certificate_btn_loading
              }`}
              onClick={() => {
                if (!loading) getCertificate(playlistId, durationPlaylist);
              }}
              disabled={percentage === 100 && login ? false : true}
            >
              {!loading ? (
                <>
                  <Icon icon="teenyicons:certificate-solid" />
                  {lang[language]["playlist"].certificate_btn}
                </>
              ) : (
                <>
                  <Icon icon="fontisto:spinner" className="spinAnimate" />
                  {lang[language]["playlist"].certificate_btn_loading}
                </>
              )}
            </button>

            <div className={styles.catalogActions}>
              <button
                className={styles.catalogBtn}
                onClick={() => setCatalogOpen(true)}
                disabled={!login || loadingSaved}
              >
                <Icon icon="mdi:bookmark-plus" />
                {savedCourse ? "Editar catálogo" : "Adicionar ao meu catálogo"}
              </button>
              {!login && (
                <span className={styles.catalogStatus}>
                  Faça login para salvar no seu catálogo.
                </span>
              )}
              {login && savedCourse && (
                <span className={styles.catalogStatus}>Salvo</span>
              )}
            </div>

            {!login && (
              <p className={styles.certificate_info}>
                {lang[language]["playlist"].certificate_info}
              </p>
            )}

            <PlaylistNavigator
              videos={videos}
              currentVideo={currentVideo}
              setCurrentVideoIndex={setCurrentVideoIndex}
              setCurrentVideo={setCurrentVideo}
              playlistId={playlistId}
            />
          </div>
        </div>
      </div>
      <Footer />
      <AddToCatalogModal
        open={catalogOpen}
        course={catalogCourse}
        savedCourse={savedCourse}
        onClose={(changed) => {
          setCatalogOpen(false);
          if (changed) fetchSavedCourse();
        }}
      />
    </>
  );
};

export default Playlist;
