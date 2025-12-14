import React from "react";
import { PAGE_PLAYLIST_GET } from "../Api";

export const PlaylistContext = React.createContext();

export const PlaylistStorage = ({ children }) => {
  const [playlistId, setPlaylistId] = React.useState("");
  const [currentVideo, setCurrentVideo] = React.useState("");
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);
  const [totalVideos, setTotalVideos] = React.useState(0);
  const [totalStorage, setTotalStorage] = React.useState(0);
  const [percentage, setPercentage] = React.useState(0);
  const [videos, setVideos] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const [durationPlaylist, setDurationPlaylist] = React.useState(0);
  const [watchedVideos, setWatchedVideos] = React.useState(
    JSON.parse(localStorage.getItem("watchedVideos")) || {}
  );

  React.useEffect(() => {
    if (videos?.items && videos.items[currentVideoIndex]) {
      setCurrentVideo(videos.items[currentVideoIndex].snippet);
    }
  }, [videos, currentVideoIndex]);

  const setPlaylistDurationSeconds = async (data, isIncrement) => {
    const videosId = data.items
      .map((item) => item.snippet.resourceId.videoId)
      .join(",");

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videosId}&key=${process.env.REACT_APP_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();
      let totalDuration = 0;
      data.items.forEach((video) => {
        const videoDuration = parseInt(
          video.contentDetails.duration
            .match(/\d+/g)
            .reduce((a, b) => a * 60 + +b)
        );
        totalDuration += videoDuration;
      });

      if (isIncrement) {
        setDurationPlaylist((prevDuration) => prevDuration + totalDuration);
      } else {
        setDurationPlaylist((prevDuration) => prevDuration - totalDuration);
      }
    }
  };

  const setPlaylist = (data, playlistId) => {
    setVideos(data);
    setPlaylistId(playlistId);
    setTotalVideos(data.pageInfo.totalResults);
    setCurrentVideoIndex(0);
    setCurrentVideo(data.items[0].snippet);
    setPlaylistDurationSeconds(data, true);
    setTotalPage(
      Math.ceil(data?.pageInfo.totalResults / data?.pageInfo.resultsPerPage)
    );
  };

  const nextPage = async () => {
    const { url, options } = PAGE_PLAYLIST_GET(
      playlistId,
      10,
      videos?.nextPageToken
    );
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      setVideos(data);
      setPage(page + 1);
      setPlaylistDurationSeconds(data, true);
    }
  };

  const prevPage = async () => {
    const { url, options } = PAGE_PLAYLIST_GET(
      playlistId,
      10,
      videos?.prevPageToken
    );
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      setVideos(data);
      setPage(page - 1);
      setPlaylistDurationSeconds(data, false);
    }
  };

  const nextPageEnded = async () => {
    const { url, options } = PAGE_PLAYLIST_GET(
      playlistId,
      10,
      videos?.nextPageToken
    );
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      setVideos(data);
      setCurrentVideoIndex(0);
      setCurrentVideo(data.items[0].snippet);
      setPlaylistDurationSeconds(data, true);
      setPage(page + 1);
    }
  };

  React.useEffect(() => {
    // totalVideos -> total number of videos in the playlist
    // totalStorage -> videos saved by the user in localStorage
    if (totalVideos === 0) setPercentage(0);
    if (totalVideos > 0 && totalStorage >= 0) {
      const percentage = (totalStorage * 100) / totalVideos;
      setPercentage(Math.ceil(percentage));
    }
  }, [totalVideos, totalStorage]);

  return (
    <PlaylistContext.Provider
      value={{
        setPlaylistId,
        setVideos,
        setCurrentVideoIndex,
        setCurrentVideo,
        setTotalVideos,
        setPlaylist,
        setTotalStorage,
        setPercentage,
        videos,
        totalVideos,
        currentVideoIndex,
        currentVideo,
        playlistId,
        percentage,
        nextPage,
        prevPage,
        page,
        totalPage,
        watchedVideos,
        durationPlaylist,
        setWatchedVideos,
        nextPageEnded,
        setPage,
        setPlaylistDurationSeconds,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
