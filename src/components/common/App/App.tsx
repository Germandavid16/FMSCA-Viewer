import { Routes, Route } from "react-router-dom";

import { Home } from "../../pages/Home/Home";
import { Information } from "../../pages/Information/Information.tsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/:id" element={<Information />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
