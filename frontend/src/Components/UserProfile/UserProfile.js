import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./UserProfile.module.css";
import UserName from "../Header/UserName";
import profile from "../../Assets/profile.png";
import { USER_GET_PROFILE } from "../../Api";

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (username.startsWith("@")) {
          const usernameWithoutAt = username.slice(1);

          const user = window.localStorage.getItem("user");
          if (user && user.username === usernameWithoutAt) {
            setUser(user);
            return;
          } else {
            const { url, options } = USER_GET_PROFILE(usernameWithoutAt);
            const response = await fetch(url, options);
            if (response.status === 404) {
              setError("Usuário não encontrado.");
            } else if (response.ok) {
              const data = await response.json();
              setUser(data);
            } else {
              throw new Error("Request failed.");
            }
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [username]);

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.profile}>
          <div className={styles.profileWrapper}>
            <div className={styles.dkjkdjdfjd}>
              {loading && <div>Loading</div>}
              {user && (
                <>
                  <img
                    className={styles.avatar}
                    src={user.avatar ? user.avatar : profile}
                  />

                  <div>
                    <h1 className={styles.nameUser}>{user?.name}</h1>
                    <UserName
                      username={user?.username}
                      isVerified={user?.isVerifiedAccount}
                    />
                  </div>
                </>
              )}
              {error && <div>{error}</div>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
