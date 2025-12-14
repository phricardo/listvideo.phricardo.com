import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./UserProfile.module.css";
import UserName from "../Header/UserName";
import profile from "../../Assets/profile.png";
import { USER_GET_PROFILE, SAVED_COURSES_BY_USERNAME } from "../../Api";
import CatalogGrid from "../Catalog/CatalogGrid";
import AddToCatalogModal from "../Catalog/AddToCatalogModal";
import { UserContext } from "../../Context/UserContext";
import { LanguageContext } from "../../Context/LanguageContext";

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [error, setError] = useState(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { user: currentUser } = useContext(UserContext);
  const { language } = useContext(LanguageContext);

  const profileUsername = username?.startsWith("@") ? username.slice(1) : null;
  const isOwner = currentUser?.username === profileUsername;

  useEffect(() => {
    async function fetchData() {
      setLoadingProfile(true);
      try {
        if (profileUsername) {
          const { url, options } = USER_GET_PROFILE(profileUsername);
          const response = await fetch(url, options);
          if (response.status === 404) {
            setError("Usuário não encontrado.");
          } else if (response.ok) {
            const data = await response.json();
            setProfileUser(data);
          } else {
            throw new Error("Falha ao carregar dados.");
          }
        } else {
          navigate("/");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchData();
  }, [profileUsername, navigate]);

  const loadSavedCourses = useCallback(async () => {
    if (!profileUsername) return;
    setLoadingCatalog(true);
    try {
      const { url, options } = SAVED_COURSES_BY_USERNAME(profileUsername);
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        setSavedCourses(data);
      } else if (response.status === 404) {
        setSavedCourses([]);
      }
    } catch (_err) {
      setError("Falha ao carregar catálogo.");
    } finally {
      setLoadingCatalog(false);
    }
  }, [profileUsername]);

  useEffect(() => {
    loadSavedCourses();
  }, [loadSavedCourses]);

  const onEditCourse = (course) => {
    if (!isOwner) return;
    setEditingCourse(course);
    setCatalogOpen(true);
  };

  const resolveCategoryLabel = (category) => {
    const labels =
      {
        pt: {
          frontend: "Front-end",
          backend: "Back-end",
          fullstack: "Full-stack",
          data: "Dados",
          devops: "DevOps",
          mobile: "Mobile",
          security: "Segurança",
          ai: "IA",
          uiux: "UI/UX",
          general: "Geral",
        },
        en: {
          frontend: "Frontend",
          backend: "Backend",
          fullstack: "Fullstack",
          data: "Data",
          devops: "DevOps",
          mobile: "Mobile",
          security: "Security",
          ai: "AI",
          uiux: "UI/UX",
          general: "General",
        },
      }[language] ||
      {};
    return labels[category] || category;
  };

  const editingCourseMeta = editingCourse
    ? {
        playlistId: editingCourse.youtubePlaylistId,
        title: editingCourse.customTitle,
        channelId: editingCourse.authorChannelId,
        channelTitle: editingCourse.authorChannelTitle,
      }
    : null;

  const catalogTitle =
    profileUser?.name || profileUser?.username || profileUsername || "usuário";
  const firstName = catalogTitle.split(" ")[0];

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.profile}>
          <div className={styles.profileWrapper}>
            <div className={styles.dkjkdjdfjd}>
              {loadingProfile && <div>Carregando...</div>}
              {profileUser && (
                <>
                  <img
                    className={styles.avatar}
                    src={profileUser.avatar ? profileUser.avatar : profile}
                    alt="Avatar do usuário"
                  />

                  <div>
                    <h1 className={styles.nameUser}>{profileUser?.name}</h1>
                    <UserName
                      username={profileUser?.username}
                      isVerified={profileUser?.isVerifiedAccount}
                    />
                  </div>
                </>
              )}
              {error && <div>{error}</div>}
            </div>
          </div>

          <div className={styles.profileContent}>
            <div className={styles.catalogHeader}>
              <h2 className={styles.catalogTitle}>Catálogo do {firstName}</h2>
              {isOwner && (
                <span className={styles.catalogHint}>
                  Seus cursos salvos são públicos
                </span>
              )}
            </div>

            {loadingCatalog ? (
              <div className={styles.catalogStatus}>Carregando catálogo...</div>
            ) : (
              <CatalogGrid
                courses={savedCourses}
                isOwner={isOwner}
                onEdit={onEditCourse}
                categoryLabelResolver={resolveCategoryLabel}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />

      <AddToCatalogModal
        open={catalogOpen}
        course={editingCourseMeta || {}}
        savedCourse={editingCourse}
        onClose={(changed) => {
          setCatalogOpen(false);
          setEditingCourse(null);
          if (changed) loadSavedCourses();
        }}
      />
    </>
  );
};

export default UserProfile;
