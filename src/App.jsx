import { Route, Routes } from "react-router-dom";
import Directory from "./Directory";
import Register from "./Register.";
import Login from "./Login";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Directory />} />
      <Route path="/directory/:dirId?" element={<Directory />} />
    </Routes>
  );
}

export default App;
