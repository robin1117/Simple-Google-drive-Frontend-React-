import { Route, Routes } from "react-router-dom";
import Directory from "./Directory";
import GitCallBack from "./callbacks/gitCallBack";
import Register from "./authPage/Register.";
import Login from "./authPage/Login";
import "./index.css";

import { ProfileContextProvider } from "./context/profileContext";
import Header from "./components/Header";
import Layout from "./Layout";
import UsersPage from "./authPage/UsersPage";

function App() {
  return (
    <ProfileContextProvider>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/gitcallback" element={<GitCallBack />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<UsersPage />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Directory />} />
          <Route path="/directory/:dirId?" element={<Directory />} />
        </Route>
      </Routes>
    </ProfileContextProvider>
  );
}

export default App;
