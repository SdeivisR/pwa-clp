// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Solo importas Navbar
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Soporte from "./pages/Soporte";
import Acerca from "./pages/Acerca";
import Configuracion from "./pages/Configuracion";
import UsersPage from "./pages/Users";
import NCheck from "./pages/nCheck";
import CPlant from "./pages/cPLant";


export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <Navbar /> {/* Renderizas Navbar sin props */}

        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/soporte" element={<Soporte />} />
            <Route path="/acerca" element={<Acerca />} />  
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/nCheck" element={<NCheck />} />
            <Route path="/cPlant" element={<CPlant />} />


 
          </Routes>
        </main>
      </div>
    </Router>
  );
}
