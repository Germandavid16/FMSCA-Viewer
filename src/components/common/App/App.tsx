import { Routes, Route } from "react-router-dom";

import { Home } from "../../pages/Home/Home";
import { SingleRecord } from "../../pages/SingleRecord/SingleRecord.tsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/:id" element={<SingleRecord />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
