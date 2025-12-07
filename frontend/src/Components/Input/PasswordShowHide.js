import React from "react";
import styles from "./PasswordShowHide.module.css";
import { Icon } from "@iconify/react";

const PasswordShowHide = ({ label, name, value, onChange, error, onBlur }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handlePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div>
        <div className={styles.password}>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            className={styles.input}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            type={showPassword ? "text" : "password"}
          ></input>
          <button onClick={handlePassword} className={styles.btn_show_hide}>
            <Icon icon={showPassword ? "mdi:eye" : "mdi:eye-off"} />
          </button>
        </div>
        {error && (
          <ul className={styles.list}>
            {error.map((el) => (
              <li>{el}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default PasswordShowHide;
