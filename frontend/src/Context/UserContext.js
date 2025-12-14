import React from "react";
import { useNavigate } from "react-router";
import {
  CERTIFICATE_POST,
  TOKEN_POST,
  USER_GET_AUTHENTICATED,
  USER_LOGOUT,
} from "../Api";
import { safeParseJson, toastApiError } from "../utils/apiErrors";

export const UserContext = React.createContext();

export const UserStorage = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [login, setLogin] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  const getUser = async () => {
    const { url, options } = USER_GET_AUTHENTICATED();
    const response = await fetch(url, options);
    if (!response.ok) return null;
    return await safeParseJson(response);
  };

  React.useEffect(() => {
    if (user) {
      window.localStorage.setItem("user", user);
    }
  }, [user]);

  React.useEffect(() => {
    const autoLogin = async () => {
      const user = await getUser();
      if (user) {
        setUser(user);
        setLogin(true);
      }
    };

    autoLogin();
  }, []);

  const userLogin = async (login, password) => {
    try {
      setError(null);
      setLoading(true);

      const { url, options } = TOKEN_POST({
        login,
        password,
      });

      const response = await fetch(url, options);
      const payload = await safeParseJson(response);

      if (response.ok) {
        const user = await getUser();

        if (user) {
          setUser(user);
          setLogin(true);
        }
      } else {
        const message = toastApiError(
          payload,
          "Não foi possível realizar o login."
        );
        throw new Error(message);
      }
    } catch (err) {
      setError(err);
      setLogin(false);
    } finally {
      setLoading(false);
    }
  };

  async function getCertificate(playlistId, duration) {
    try {
      setError(null);
      setLoading(true);
      const { url, options } = CERTIFICATE_POST({
        playlistId: playlistId,
        durationInSeconds: duration,
      });
      const response = await fetch(url, options);
      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `certificate_${playlistId}.pdf`;
        link.click();
      } else {
        const payload = await safeParseJson(response);
        const message = toastApiError(
          payload,
          "Não foi possível gerar o certificado. Tente novamente."
        );
        setError(new Error(message));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  const userLogout = React.useCallback(
    async (messageConfirm) => {
      const confirmLogout = window.confirm(messageConfirm);
      if (!confirmLogout) return;

      const logoutErrorMessage =
        "Não foi possível encerrar a sessão. Tente novamente.";

      try {
        setError(null);
        setLoading(true);

        const { url, options } = USER_LOGOUT();
        const response = await fetch(url, options);

        if (!response.ok) {
          const payload = await safeParseJson(response);
          const message = toastApiError(
            payload,
            logoutErrorMessage
          );
          throw new Error(message);
        }

        setUser(null);
        setLogin(false);
        navigate("/login");
      } catch (err) {
        setError(err);
        toastApiError(err, logoutErrorMessage);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  return (
    <UserContext.Provider
      value={{
        userLogin,
        getCertificate,
        login,
        user,
        loading,
        userLogout,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

