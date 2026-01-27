import React from "react";
import styles from "./InputUsernameAvailability.module.css";
import { Icon } from "@iconify/react";
import { USER_CHECK_USERNAME } from "../../Api";

const InputUsernameAvailability = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  onBlur,
}) => {
  const [isAvailable, setIsAvailable] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const checkAvailability = async (value) => {
    if (value) {
      try {
        setIsLoading(true);
        const { url, options } = USER_CHECK_USERNAME(value);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Erro ao verificar disponibilidade.");
        const data = await response.json();
        setIsAvailable(data.availability);
      } catch (error) {
        console.error(
          "Erro ao verificar disponibilidade do nome de usuário:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  function isValidEmail(value) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(value);
  }

  return (
    <div className={styles.wrapper}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>

      <input
        id={name}
        className={styles.input}
        type={type}
        onChange={onChange}
        onInput={async (event) => {
          const inputValue = event.target.value;
          if (!isValidEmail(inputValue) && inputValue.length >= 3) {
            checkAvailability(inputValue);
          }
        }}
        onBlur={onBlur}
        value={value}
      />

      {error && (
        <ul className={styles.list}>
          {error.map((el, index) => (
            <li key={index}>{el}</li>
          ))}
        </ul>
      )}

      {isLoading && (
        <div className={styles.status}>
          <Icon className={styles.spin} icon="la:spinner" />
          Verificando
        </div>
      )}

      {!isLoading && !error && isAvailable != null && (
        <div
          className={`${styles.status} ${
            isAvailable ? styles.success : styles.error
          }`}
        >
          <Icon icon={isAvailable ? "gg:check-o" : "icon-park-solid:error"} />
          {isAvailable ? "Disponível" : "Já em uso"}
        </div>
      )}
    </div>
  );
};

export default InputUsernameAvailability;
