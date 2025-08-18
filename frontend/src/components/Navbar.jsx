import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { ChevronRight, ChevronDown, Search } from "lucide-react";

export default function Navbar() {
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [isOpen, setIsOpen] = useState(false);
  // Estado para controlar qué submenú (dropdown o acordeón) está abierto
  const [activeMenu, setActiveMenu] = useState(null);

   const [searchValue, setSearchValue] = useState("");

  // Función para alternar el estado del menú móvil y cerrar submenús
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveMenu(null); // Cierra cualquier submenú abierto al cerrar el menú principal
    }
  };

  // Función para manejar la apertura y cierre de submenús
  const handleSubMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };
    // Función para manejar la búsqueda (lógica futura)
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchValue);
    // Aquí es donde se añadiría la lógica real de búsqueda,
    // por ejemplo, redireccionar a una página de resultados o filtrar datos.
  };


  return (
    <>
      {/* Navbar fija en la parte superior */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-[60px] md:h-[70px]">
        <div className="flex items-center justify-between px-4 py-3 h-full">
          <Link to="/" className="text-xl font-bold">
            Group Sitem
          </Link>

          {/* Menú de escritorio (visible en pantallas grandes) */}
          <div className="hidden [@media(min-width:766px)]:flex">
            <ul className="flex items-center space-x-6 text-gray-800">
              {/* Opción con menú desplegable para "Example" */}
              <li className="relative flex items-center">
                <button
                  onClick={() => handleSubMenu("example")}
                  className="flex items-center hover:text-gray-600 focus:outline-none"
                >
                  Example
                  <ChevronDown size={18} className="ml-1 text-gray-500" />
                </button>
                <ul
                  className={`absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 ${
                    activeMenu === "example"
                      ? "visible opacity-100 scale-100"
                      : "invisible opacity-0 scale-95"
                  }`}
                >
                  <li><Link to="/About" className="block px-4 py-2 hover:bg-gray-100" onClick={() => handleSubMenu(null)}>Sobre</Link></li>
                  <li><Link to="/example/2" className="block px-4 py-2 hover:bg-gray-100" onClick={() => handleSubMenu(null)}>Example 2</Link></li>
                  <li><Link to="/example/3" className="block px-4 py-2 hover:bg-gray-100" onClick={() => handleSubMenu(null)}>Example 3</Link></li>
                </ul>
              </li>
              {/* Opción con menú desplegable para "Sobre" */}
              <li className="relative flex items-center">
                <button
                  onClick={() => handleSubMenu("sobre")}
                  className="flex items-center hover:text-gray-600 focus:outline-none"
                >
                  Sobre
                  <ChevronDown size={18} className="ml-1 text-gray-500" />
                </button>
                <ul
                  className={`absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 ${
                    activeMenu === "sobre"
                      ? "visible opacity-100 scale-100"
                      : "invisible opacity-0 scale-95"
                  }`}
                >
                  <li><Link to="/sobre/mision" className="block px-4 py-2 hover:bg-gray-100">Misión</Link></li>
                  <li><Link to="/sobre/equipo" className="block px-4 py-2 hover:bg-gray-100">Equipo</Link></li>
                </ul>
              </li>
              {/* Enlace simple */}
              <li>
                <Link to="/contact" className="hover:text-gray-600">Contáctanos</Link>
              </li>
              {/* Barra de búsqueda para escritorio */}
              <li className="relative">
                <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded-full px-4 py-2 hover:border-gray-500 transition-colors duration-200">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Buscar..."
                    className="outline-none text-sm w-48 bg-transparent"
                  />
                  <button type="submit" className="ml-2 text-gray-500 hover:text-gray-700">
                    <Search size={20} />
                  </button>
                </form>
              </li>
            </ul>
          </div>

          {/* Botón para el menú móvil (visible en pantallas pequeñas) */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`hamburger-button ${isOpen ? "open" : ""}`}
            >
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </button>
          </div>
        </div>
      </nav>

      {/* Espaciador para evitar que el contenido se superponga con la navbar fija */}
      <div className="h-[60px] md:h-[70px]"></div>

 

      {/* Menú móvil (se desliza desde arriba) */}
      <div
        className={`fixed top-[60px] md:top-[70px] left-0 w-full h-full bg-gray-100 shadow-lg transform transition-transform duration-100 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ zIndex: 5 }}
      >
        <div className="p-6">
          <ul className="space-y-3 mb-8">

            {/* Barra de búsqueda para móvil */}
            <li className="border-b border-gray-300 py-3">
              <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Buscar..."
                  className="outline-none text-sm w-full bg-transparent"
                />
                <button type="submit" className="ml-2 text-gray-500 hover:text-gray-700">
                  <Search size={20} />
                </button>
              </form>
            </li>
            {/* Barra de Example */}
            <li className="flex flex-col border-b border-gray-300 py-3">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleSubMenu("example")}
              >
                <div className="text-gray-800">Example</div>
                <ChevronRight
                  size={20}
                  className={`text-gray-500 transition-transform ${
                    activeMenu === "example" ? "rotate-90" : "rotate-0"
                  }`}
                />
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeMenu === "example" ? "max-h-96 mt-2" : "max-h-0 mt-0"
                }`}
              >
                <ul className="space-y-2 pl-4 pt-2">
                  <li>
                    <Link to="/example/1" className="block text-gray-600 hover:text-gray-800" onClick={toggleMenu}>
                      Example 1
                    </Link>
                  </li>
                  <li>
                    <Link to="/About" className="block text-gray-600 hover:text-gray-800" onClick={toggleMenu}>
                      Sobre
                    </Link>
                  </li>
                  <li>
                    <Link to="/example/3" className="block text-gray-600 hover:text-gray-800" onClick={toggleMenu}>
                      Example 3
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            {/* Elemento de acordeón para "Sobre" en móvil */}
            <li className="flex flex-col border-b border-gray-300 py-3">
                <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleSubMenu("sobre")}
              >
                <div className="text-gray-800">Example</div>
                <ChevronRight
                  size={20}
                  className={`text-gray-500 transition-transform ${
                    activeMenu === "sobre" ? "rotate-90" : "rotate-0"
                  }`}
                />
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeMenu === "sobre" ? "max-h-96 mt-2" : "max-h-0 mt-0"
                }`}
              >
                <ul className="space-y-2 pl-4 pt-2">
                  <li>
                    <Link to="/sobre/mision" className="block text-gray-600 hover:text-gray-800" onClick={toggleMenu}>
                      Misión
                    </Link>
                  </li>
                  <li>
                    <Link to="/sobre/equipo" className="block text-gray-600 hover:text-gray-800" onClick={toggleMenu}>
                      Equipo
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            {/* Enlace simple en móvil */}
            <li className="flex justify-between items-center border-b border-gray-300 py-3">
              <Link to="/contact" className="text-gray-800" onClick={toggleMenu}>
                Contáctanos
              </Link>
              <ChevronRight size={20} className="text-gray-500" />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}