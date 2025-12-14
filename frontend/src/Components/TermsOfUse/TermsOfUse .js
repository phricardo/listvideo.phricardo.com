import React from "react";
import styles from "./TermsOfUse.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { LanguageContext } from "../../Context/LanguageContext";
import lang from "../../lang.json";

const TermsOfUse = () => {
  const { language } = React.useContext(LanguageContext);
  const terms = lang[language]?.terms || lang.en.terms;

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>{terms.title}</h1>
          <p className={styles.lead}>{terms.lead}</p>

          <div className={styles.sections}>
            {terms.sections?.map((section) => (
              <section className={styles.section} key={section.title}>
                <h2>{section.title}</h2>
                <ul>
                  {section.items?.map((item, index) => (
                    <li key={`${section.title}-${index}`}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className={styles.note}>{terms.footerNote}</p>
          <p className={styles.lastUpdate}>{terms.lastUpdate}</p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfUse;
