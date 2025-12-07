import React from "react";
import styles from "./Input.module.css";

const Input = ({ label, type, name, value, onChange, error, onBlur }) => {
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
        onBlur={onBlur}
        value={value}
      ></input>
      {error && (
        <ul className={styles.list}>
          {error.map((el) => (
            <li>{el}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Input;
