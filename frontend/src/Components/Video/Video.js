import React from "react";
import styles from "./Video.module.css";
import YouTube from "@u-wave/react-youtube";
import SwitchButton from "../Helper/SwitchButton";
import { AutoplayContext } from "../../Context/AutoplayContext";
import { LanguageContext } from "../../Context/LanguageContext";
import { Icon } from "@iconify/react";
import lang from "../../lang.json";
import { PlaylistContext } from "../../Context/PlaylistContext";

const Video = ({ currentVideo, currentVideoIndex, playlistId }) => {
  const { autoplay } = React.useContext(AutoplayContext);
  const { language } = React.useContext(LanguageContext);
  const {
    videos,
    page,
    totalPage,
    setCurrentVideoIndex,
    setCurrentVideo,
    nextPageEnded,
    watchedVideos,
    setWatchedVideos,
  } = React.useContext(PlaylistContext);
  const [check, setCheck] = React.useState(false);

  React.useEffect(() => {
    if (watchedVideos[playlistId])
      setCheck(
        watchedVideos[playlistId].includes(currentVideo?.resourceId?.videoId)
      );
  }, [currentVideo]);

  React.useEffect(() => {
    if (check) saveWatchedVideo(playlistId, currentVideo?.resourceId?.videoId);
    else removeWatchedVideo(playlistId, currentVideo?.resourceId?.videoId);
  }, [check]);

  const saveWatchedVideo = (playlistId, videoId) => {
    let watchedVideos = JSON.parse(localStorage.getItem("watchedVideos")) || {};
    if (!watchedVideos[playlistId]) {
      watchedVideos[playlistId] = [];
      setWatchedVideos(watchedVideos);
    }
    if (!watchedVideos[playlistId].includes(videoId)) {
      watchedVideos[playlistId].push(videoId);
      setWatchedVideos(watchedVideos);
      localStorage.setItem("watchedVideos", JSON.stringify(watchedVideos));
    }
  };

  const removeWatchedVideo = (playlistId, videoId) => {
    let watchedVideos = JSON.parse(localStorage.getItem("watchedVideos")) || {};
    if (!watchedVideos[playlistId]) {
      return;
    }
    let index = watchedVideos[playlistId].indexOf(videoId);
    if (index > -1) {
      watchedVideos[playlistId].splice(index, 1);
      setWatchedVideos(watchedVideos);
      localStorage.setItem("watchedVideos", JSON.stringify(watchedVideos));
    }
  };

  const handleEnded = () => {
    if (!autoplay) return;
    if (currentVideoIndex + 1 < videos.items.length) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else if (page < totalPage) {
      nextPageEnded(videos?.nextPageToken);
    }
  };

  if (!currentVideo) return null;
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{currentVideo.title}</h1>
      <YouTube
        video={currentVideo.resourceId.videoId}
        className={styles.video}
        onEnd={() => {
          saveWatchedVideo(playlistId, currentVideo.resourceId.videoId);
          handleEnded();
        }}
        autoplay
        annotations={false}
        modestBranding={true}
        showRelatedVideos={false}
      />
      <div className={styles.video_footer}>
        <SwitchButton
          label={lang[language]["playlist"].watched}
          onChange={() => setCheck(!check)}
          color="#b1e458"
          checked={check}
        />

        <h1>
          {lang[language]["playlist"].author}{" "}
          <strong>{currentVideo.videoOwnerChannelTitle}</strong>{" "}
          <Icon icon="material-symbols:check-circle" className={styles.icon} />
        </h1>
      </div>
    </div>
  );
};

export default Video;
