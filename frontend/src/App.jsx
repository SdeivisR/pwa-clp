// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Soporte from "./pages/Soporte";
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
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Register />} />
            <Route path="/Home"element={<MainLayout><Home/></MainLayout>}/>
            <Route path="/soporte" element={<MainLayout><Soporte/></MainLayout>} /> 
            <Route path="/configuracion" element={<MainLayout><Configuracion /></MainLayout>} />
            <Route path="/users" element={<MainLayout><UsersPage /></MainLayout>} />
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
