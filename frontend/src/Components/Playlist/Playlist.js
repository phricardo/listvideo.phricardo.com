import React from "react";
import Header from "../Header/Header";
import Video from "../Video/Video";
import Footer from "../Footer/Footer";
import PlaylistNavigator from "./PlaylistNavigator";
import ProgessBar from "../Helper/ProgessBar";
import styles from "./Playlist.module.css";
import { useParams } from "react-router-dom";
import { PlaylistContext } from "../../Context/PlaylistContext";
import { PLAYLIST_GET } from "../../Api";
import { UserContext } from "../../Context/UserContext";
import { Icon } from "@iconify/react";
import { LanguageContext } from "../../Context/LanguageContext";
import lang from "../../lang.json";

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

  React.useEffect(() => {
    const fetchData = async () => {
      const { url, options } = PLAYLIST_GET(playlistId, 10);
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        setPage(1);
        setPlaylist(data, playlistId);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (watchedVideos[playlistId])
      setTotalStorage(watchedVideos[playlistId].length);
  }, [watchedVideos]);

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.video}>
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
                !loading && getCertificate(playlistId, durationPlaylist);
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

            {!login && (
              <p className={styles.certificate_info}>
                ⚠️ {lang[language]["playlist"].certificate_info}
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
    </>
  );
};

export default Playlist;
