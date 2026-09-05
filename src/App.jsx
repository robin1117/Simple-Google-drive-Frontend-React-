import { Route, Routes } from "react-router-dom";
import Directory from "./Directory";
import Register from "./authPage/Register.";
import Login from "./authPage/Login";
import "./index.css";

import { HeaderContextProvider } from "./context/HeaderContext";
import Layout from "./Layout";
import UsersPage from "./authPage/UsersPage";
import GitCallBack from "./authPage/callbacks/gitCallBack";
import { DirectoryContextProvider } from "./context/DirectoryContext";
import ForgotPasswordPage from "./authPage/ForgotPasswordPage";
import PasswordReset from "./authPage/passwordReset";
import NotFound from "./components/NotFound";

function App() {
  return (
    <DirectoryContextProvider>
      <HeaderContextProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/gitcallback" element={<GitCallBack />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetPassword" element={<ForgotPasswordPage />} />
          <Route path="/passwordReset" element={<PasswordReset />} />
          <Route path="/users" element={<UsersPage />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Directory />} />
            <Route path="/directory/:dirId?" element={<Directory />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HeaderContextProvider>
    </DirectoryContextProvider>
  );
}

export default App;
