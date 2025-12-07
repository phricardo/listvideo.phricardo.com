export const API_URL = (process.env.REACT_APP_LISTVIDEO_API_URL || "").trim();
export const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?&key=${process.env.REACT_APP_API_KEY}&part=snippet`;

/* API CONFIGS */

export const TOKEN_POST = (body) => {
  return {
    url: API_URL + "/auth/login",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    },
  };
};

export const USER_LOGOUT = () => {
  return {
    url: API_URL + "/auth/logout",
    options: {
      method: "POST",
      credentials: "include",
    },
  };
};

export const USER_POST = (body) => {
  return {
    url: API_URL + "/auth/register",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
};

export const USER_CHECK_EMAIL = (id) => {
  return {
    url: `${API_URL}/account/activation/${id}`,
    options: {
      method: "PATCH",
    },
  };
};

export const USER_GET_AUTHENTICATED = () => {
  return {
    url: API_URL + "/auth/authenticated/user",
    options: {
      method: "GET",
      credentials: "include",
    },
  };
};

export const STATUS_HEALTH = () => {
  return {
    url: API_URL + "/status/health",
    options: {
      method: "GET",
    },
  };
};

export const STATUS_FEATURES = () => {
  return {
    url: API_URL + "/status/features",
    options: {
      method: "GET",
    },
  };
};

export const USER_RESEND_ACTIVATION_LINK = (email) => {
  return {
    url: `${API_URL}/account/activation/resend?email=${email}`,
    options: {
      method: "POST",
    },
  };
};

export const USER_SEND_TOKEN_PASSWORD = (email) => {
  return {
    url: `${API_URL}/account/password/forgot?email=${email}`,
    options: {
      method: "POST",
    },
  };
};

export const USER_RESET_TOKEN_PASSWORD = (body) => {
  return {
    url: `${API_URL}/account/password/reset`,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
};

export const USER_GET_PROFILE = (username) => {
  return {
    url: `${API_URL}/user/${username}`,
    options: {
      method: "GET",
    },
  };
};

export const USER_CHECK_USERNAME = (username) => {
  return {
    url: `${API_URL}/user/check-username/${username}`,
    options: {
      method: "GET",
    },
  };
};

export const CERTIFICATE_POST = (body) => {
  return {
    url: API_URL + "/certificate",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    },
  };
};

export const PLAYLIST_GET = (playlistId, maxResults) => {
  return {
    url: YOUTUBE_API_URL + `&maxResults=${maxResults}&playlistId=${playlistId}`,
    options: {
      method: "GET",
    },
  };
};

export const PAGE_PLAYLIST_GET = (playlistId, maxResults, pageToken) => {
  const URL = pageToken
    ? `&maxResults=${maxResults}&playlistId=${playlistId}&pageToken=${pageToken}`
    : `&maxResults=${maxResults}&playlistId=${playlistId}`;

  return {
    url: YOUTUBE_API_URL + URL,
    options: {
      method: "GET",
    },
  };
};
