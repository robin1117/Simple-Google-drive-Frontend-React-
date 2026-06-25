import { Route, Routes } from "react-router-dom";
import Directory from "./Directory";
import GitCallBack from "./callbacks/gitCallBack";
import Register from "./authPage/Register.";
import Login from "./authPage/Login";
import "./index.css";


function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/gitcallback" element={<GitCallBack />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Directory />} />
        <Route path="/directory/:dirId?" element={<Directory />} />
      </Routes>
    </>
  );
}

export default App;
