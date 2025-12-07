import React from "react";
import "./App.css";
import Home from "./Components/Home/Home";
import Playlist from "./Components/Playlist/Playlist";
import Login from "./Components/Login/Login";
import LoginRegister from "./Components/Login/LoginRegister";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeContext } from "./Context/ThemeContext";
import { UserStorage } from "./Context/UserContext";
import Settings from "./Components/Settings/Settings";
import TermsOfUse from "./Components/TermsOfUse/TermsOfUse ";
import LoginValidate from "./Components/Login/LoginValidate";
import UserProfile from "./Components/UserProfile/UserProfile";
import PasswordSendLink from "./Components/PasswordReset/PasswordSendLink";
import ResendLinkActivation from "./Components/ResendLinkActivation/ResendLinkActivation";
import { ServiceStatusProvider } from "./Context/ServiceStatusContext";
import ServiceStatusBanner from "./Components/ServiceStatusBanner/ServiceStatusBanner";

function App() {
  const { theme } = React.useContext(ThemeContext);

  return (
    <div className={`theme-${theme}`}>
      <ServiceStatusProvider>
        <ServiceStatusBanner />
        <BrowserRouter>
          <UserStorage>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/playlist/:playlistId" element={<Playlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<LoginRegister />} />
              <Route path="/activate-account/:id" element={<LoginValidate />} />
              <Route path="/:username" element={<UserProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/:username" element={<UserProfile />} />
              <Route path="/forgot-password" element={<PasswordSendLink />} />
              <Route
                path="/resend-activation"
                element={<ResendLinkActivation />}
              />
              <Route
                path="/forgot-password/:token"
                element={<PasswordSendLink />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </UserStorage>
        </BrowserRouter>
      </ServiceStatusProvider>
    </div>
  );
}

export default App;
