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
import GPlant from "./pages/gPLant";
import HCheck from "./pages/hCheck";
import Register from "./pages/Register";
import ChecklistTemplateBuilder from "./pages/cPlant";
import MainLayout from "./pages/MainLayout";





export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen">

        <main>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/Home"element={<MainLayout><Home/></MainLayout>}/>
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/soporte" element={<Soporte />} />
            <Route path="/acerca" element={<Acerca />} />  
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/nCheck" element={<MainLayout><NCheck/></MainLayout>} />
            <Route path="/cPlant" element={<MainLayout><CPlant/></MainLayout>} />
            <Route path="/gPlant" element={<MainLayout><GPlant/></MainLayout>} />
            <Route path="/hCheck" element={<MainLayout><HCheck/></MainLayout>} />
            <Route path="/cplant/:filename" element={<ChecklistTemplateBuilder />} />



 
          </Routes>
        </main>
      </div>
    </Router>
  );
}
