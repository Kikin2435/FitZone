import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import Membresias from "./pages/Membresias";
import Clases from "./pages/Clases";
import ClasesCrud from "./pages/ClasesCrud";
import Instalaciones from "./pages/Instalaciones";
import Usuarios from "./pages/Usuarios";
import Acceso from "./pages/Acceso";
import Decisiones from "./pages/Decisiones";
import Membresias2 from "./pages/Membresias2";
import DecisionesClases from "./pages/DecisionesClases";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/membresias" element={<Membresias />} />
        <Route path="/clases" element={<Clases />} />
        <Route path="/clases-crud" element={<ClasesCrud />} />
        <Route path="/instalaciones" element={<Instalaciones />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/acceso" element={<Acceso />} />
        <Route path="/decisiones" element={<Decisiones />} />
        <Route path="/renovar" element={<Membresias2 />} />
        <Route path="/analisis-clases" element={<DecisionesClases />} />
      </Routes>
    </BrowserRouter>
  );
}