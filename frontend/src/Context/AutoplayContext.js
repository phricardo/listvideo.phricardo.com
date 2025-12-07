import React from "react";

export const AutoplayContext = React.createContext();

export const AutoplayStorage = ({ children }) => {
  const [autoplay, setAutoplay] = React.useState(true);

  React.useEffect(() => {
    const autoplayLocal = localStorage.getItem("autoplay");
    if (autoplayLocal) setAutoplay(autoplayLocal === "true");
  }, []);

  const handleAutoplay = (value) => {
    setAutoplay(value);
    localStorage.setItem("autoplay", value);
  };

  return (
    <AutoplayContext.Provider value={{ autoplay, handleAutoplay }}>
      {children}
    </AutoplayContext.Provider>
  );
};
