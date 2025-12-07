import React from "react";
import { LanguageContext } from "../Context/LanguageContext";

const types = {
  email: {
    regex:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    pt: ["Preencha um email válido."],
    en: ["Fill in a valid email."],
  },
  password: {
    regex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/,
    pt: [
      "Precisa ter 1 caracter maíusculo, 1 minúsculo e 1 digito.",
      "Mínimo de 8 caracteres.",
    ],
    en: [
      "Must have 1 uppercase, 1 lowercase and 1 digit.",
      "Minimum 8 characters.",
    ],
  },
  username: {
    regex: /^[a-zA-Z_][\w_.]{2,17}$/,
    pt: [
      "Pelo menos 3 e no máximo 18 caracteres.",
      "Pode ser composto por letras, números, pontos (.) e sublinhado (_).",
      "Não pode começar com caractere especial, exceto com sublinhado (_). ",
    ],
    en: [
      "At least 3 and maximum 18 characters.",
      "It can be composed of letters, numbers, periods (.) and underscore (_).",
      "Cannot start with special character except underscore (_). ",
    ],
  },
  number: {
    regex: /^\d+$/,
    pt: ["Utilize números apenas."],
    en: ["Use numbers only."],
  },
};

const field = {
  empty: {
    pt: ["Preencha este campo."],
    en: ["Fill in this field."],
  },
};

const useForm = (type) => {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(null);
  const { language } = React.useContext(LanguageContext);

  const validate = (value) => {
    if (type === false) return true;
    if (value.length === 0) {
      setError(field.empty[language]);
      return false;
    } else if (types[type] && !types[type].regex.test(value)) {
      setError(types[type][language]);
      return false;
    } else {
      setError(null);
      return true;
    }
  };

  const onChange = ({ target }) => {
    if (error) validate(target.value);
    setValue(target.value);
  };

  return {
    value,
    setValue,
    onChange,
    error,
    onBlur: () => validate(value),
    validate: () => validate(value),
  };
};

export default useForm;
