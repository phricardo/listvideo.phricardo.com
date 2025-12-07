import React from "react";
import styles from "./ProgessBar.module.css";
import { LanguageContext } from "../../Context/LanguageContext";
import lang from "../../lang.json";

const ProgessBar = ({ percentage, completeColorBar }) => {
  const { language } = React.useContext(LanguageContext);

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        {percentage}% {lang[language]["playlist"].assisted}
      </div>
      <div className={styles.progress}>
        <div
          className={styles.bar}
          style={{
            background: `${percentage === 100 ? completeColorBar : ""}`,
            width: `${percentage}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgessBar;
