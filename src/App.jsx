import { useEffect, useState } from "react";
import { data, Link, Route, Routes, useParams } from "react-router-dom";
import Directory from "./Directory";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Directory />} />
    </Routes>
  );
}

export default App;
