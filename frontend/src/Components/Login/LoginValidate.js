import React from "react";
import { useNavigate, useParams } from "react-router";
import { USER_CHECK_EMAIL } from "../../Api";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from "./LoginValidate.module.css";
import Confetti from "react-confetti";
import useWindowSize from "../../Hooks/useWindowSize";

const LoginValidate = () => {
  const { id } = useParams();
  const [check, setCheck] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const size = useWindowSize();
  const navigate = useNavigate();

  React.useEffect(() => {
    async function checkUserId(id) {
      try {
        setLoading(true);
        const { url, options } = USER_CHECK_EMAIL(id);
        const response = await fetch(url, options);
        const data = await response.json();

        setCheck(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    checkUserId(id);
  }, []);

  if (check && !loading)
    return (
      <>
        <Header className={styles.test} />
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.content}>
              {!check && loading ? (
                <>
                  <h1>Verificando...</h1>
                </>
              ) : (
                <>
                  <Confetti width={size.width} height={size.height} />
                  <h1>🎉 Parabéns! E-mail verificado! 🎉</h1>
                  <p>Você já pode acessar a plataforma!</p>
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );

  if (!check && !loading) return navigate("/");
};

export default LoginValidate;
