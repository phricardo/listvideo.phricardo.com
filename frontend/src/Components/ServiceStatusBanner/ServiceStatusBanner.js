import React from "react";
import styles from "./ServiceStatusBanner.module.css";
import { ServiceStatusContext } from "../../Context/ServiceStatusContext";

const ServiceStatusBanner = () => {
  const { apiOnline, loading, refreshStatus } =
    React.useContext(ServiceStatusContext);

  if (apiOnline) return null;

  return (
    <div className={styles.banner} role="alert">
      <div className={styles.content}>
        <p className={styles.title}>Serviços parcialmente disponíveis</p>
        <p className={styles.message}>
          Não conseguimos contatar a API agora. Algumas funcionalidades podem
          não funcionar até que a conexão seja restabelecida.
        </p>
      </div>
      <button
        className={styles.action}
        onClick={refreshStatus}
        disabled={loading}
        type="button"
      >
        {loading ? "Verificando..." : "Tentar novamente"}
      </button>
    </div>
  );
};

export default ServiceStatusBanner;
