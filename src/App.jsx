import { Route, Routes } from "react-router-dom";
import Directory from "./Directory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Directory />} />
      <Route path="/directory/:dirId?" element={<Directory />} />
    </Routes>
  );
}

export default App;
