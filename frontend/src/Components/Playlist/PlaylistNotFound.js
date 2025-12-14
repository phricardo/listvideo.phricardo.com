import React from "react";
import { Link } from "react-router-dom";
import styles from "./PlaylistNotFound.module.css";
import infoCode from "../../Assets/infoCode.png";

const PlaylistNotFound = () => {
  return (
    <div className={styles.error}>
      <div className={styles.container}>
        <h1>Ops! Playlist não encontrada!</h1>
        <br />
        <p>Verifique a URL informada e tente novamente.</p>
        <br /> <br />
        <Link to="/" className={`btn-default ${styles.btn}`}>
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default PlaylistNotFound;
