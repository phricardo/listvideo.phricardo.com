import React from "react";
import styles from "./PlaylistNavigator.module.css";
import { LanguageContext } from "../../Context/LanguageContext";
import { PlaylistContext } from "../../Context/PlaylistContext";
import lang from "../../lang.json";

function PlaylistNavigator({
  videos,
  currentVideo,
  setCurrentVideoIndex,
  setCurrentVideo,
  playlistId,
}) {
  const { language } = React.useContext(LanguageContext);
  const { nextPage, prevPage, page, totalPage, watchedVideos } =
    React.useContext(PlaylistContext);

  const handleSelect = (index) => {
    if (!videos?.items?.[index]) return;
    setCurrentVideoIndex(index);
  };

  const isPlayingNow = (videoId) => {
    return currentVideo?.resourceId.videoId === videoId
      ? styles.playingNow
      : undefined;
  };

  const isAlreadyWatched = (videoId) => {
    if (watchedVideos[playlistId]?.includes(videoId)) return styles.saved;
    return undefined;
  };

  return (
    <>
      <ul className={styles.ul}>
        {videos?.items.map((video, index) => (
          <li key={video.id}>
            <button
              type="button"
              onClick={() => handleSelect(index)}
              className={`${styles.item} ${isPlayingNow(
                video.snippet.resourceId.videoId
              )} ${isAlreadyWatched(video.snippet.resourceId.videoId)}`}
            >
            <img
              src={
                Object.keys(video.snippet.thumbnails).length > 0
                  ? video.snippet.thumbnails.medium.url
                  : `https://via.placeholder.com/320x180.png?text=${video.snippet.title}`
              }
              alt={video.snippet.title}
              className={styles.thumbnail}
            />
            {video.snippet.title}
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.btnGroup}>
        {page > 1 && (
          <button className="btn-default-outline" onClick={prevPage}>
            {lang[language]["playlist"].btn_back_page}
          </button>
        )}
        {page <
          videos?.pageInfo.totalResults / videos?.pageInfo.resultsPerPage && (
          <button className="btn-default" onClick={nextPage}>
            {lang[language]["playlist"].btn_next_page}
          </button>
        )}
      </div>

      <p className={styles.page}>
        {lang[language]["playlist"].page} {page} / {totalPage}
      </p>
    </>
  );
}

export default PlaylistNavigator;
