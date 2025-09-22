import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import UserMenu from "./UserMenu";
import {
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Loader,
} from "lucide-react";

// Datos de ejemplo para la búsqueda (en un proyecto real vendría de una API)
const allItems = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "Sobre", path: "/sobre" },
  { id: 3, name: "configuracion", path: "/Configuracion" },
  { id: 4, name: "Example 2", path: "/example/2" },
  { id: 5, name: "Example 3", path: "/example/3" },
  { id: 6, name: "Misión", path: "/sobre/mision" },
  { id: 7, name: "Equipo", path: "/sobre/equipo" },
  { id: 8, name: "Contáctanos", path: "/contact" },
];

// Sugerencias comunes
const searchSuggestions = ["Example 1", "Misión", "Equipo", "Contacto"];

// Hook personalizado para debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuRef = useRef(null);
  const checklistMenuRef = useRef(null);

  // Cierra menús al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        checklistMenuRef.current &&
        !checklistMenuRef.current.contains(event.target)
      ) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simulación de usuario autenticado
  const [user] = useState({
    isLoggedIn: true,
    name: "Deiv",
    email: "sdeivisr@gmail.com",
    profilePic: "https://placehold.co/100x100/0D0D0D/FFFFFF?text=DS",
    role: "admin",
  });

  // Debounce para búsqueda
  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Filtra items en búsqueda
    useEffect(() => {
    if (debouncedSearchValue.length > 0) {
      setLoading(true);
      setTimeout(() => {
        const results = allItems.filter((item) =>
          item.name.toLowerCase().includes(debouncedSearchValue.toLowerCase())
        );
        setFilteredItems(results);
        setLoading(false);
      }, 500);
      setShowSuggestions(false);
    } else {
      setFilteredItems([]);
      setLoading(false);
    }
  }, [debouncedSearchValue]);

  // Resalta coincidencias en búsqueda
  const highlightMatch = (text, highlight) => {
    if (!highlight) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span
              key={i}
              className="font-bold text-blue-600 bg-yellow-200"
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) setActiveMenu(null);
  };

  const handleSubMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setShowSuggestions(e.target.value.length === 0);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setFilteredItems([]);
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
  };

  return (
    <>
      {/* Navbar fija */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-[60px] md:h-[70px]">
        <div className="flex items-center justify-between px-4 py-3 h-full">
          <Link to="/" className="text-xl font-bold">
            Group Sitem
          </Link>

          {/* Menú escritorio */}
          <div className="hidden [@media(min-width:766px)]:flex justify-end space-x-6 text-gray-800 w-full">
            <ul className="flex items-center space-x-6 ml-auto">
              {/* Barra de búsqueda */}
              <div className="relative ml-6 justify-end">
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 hover:border-gray-500 transition-colors duration-200">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Buscar..."
                    className="outline-none text-sm w-48 bg-transparent"
                  />
                  {loading ? (
                    <Loader size={20} className="animate-spin text-gray-500 ml-2"
                    />
                  ) : searchValue.length > 0 ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  ) : (
                    <Search size={20} className="text-gray-500 ml-2" />
                  )}
                </div>

                {/* Resultados búsqueda */}
                {searchValue.length > 0 && (
                  <ul className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden z-50">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <li key={item.id}>
                          <Link
                            to={item.path}
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={handleClearSearch}
                          >
                            {highlightMatch(item.name, debouncedSearchValue)}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500 italic">
                        No se encontraron resultados.
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <li>
                <Link
                  to="/"
                  className="hover:text-gray-600 text-xl"
                >
                  Home
                </Link>
              </li>

              <li className="relative flex justify-end">
                <button
                  onClick={() => handleSubMenu("Checklist")}
                  className="flex items-center hover:text-gray-600 focus:outline-none text-xl"
                >
                  Checklist
                  <ChevronDown
                    size={18}
                    className="ml-1 text-gray-500"
                  />
                </button>
                <ul
                  ref={checklistMenuRef}
                  className={`absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 ${
                    activeMenu === "Checklist"
                      ? "visible opacity-100 scale-100"
                      : "invisible opacity-0 scale-95"
                  }`}
                >
                  <li>
                    <Link
                      to="/nCheck"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleSubMenu(null)}
                    >
                      Nuevo checklist
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/hCheck"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleSubMenu(null)}
                    >
                      Historial de checklists
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cPLant"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleSubMenu(null)}
                    >
                      Crear plantilla
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/gPLant"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleSubMenu(null)}
                    >
                      Gestión de plantillas
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="relative w-10 h-10">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors duration-200"
              >
                {user.isLoggedIn ? (
                  <img src={user.profilePic} alt="Perfil de usuario" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <UserCircle2 size={24} />
                )}
              </button>

            {showUserMenu && (
              <UserMenu
                ref={menuRef}
                user={user}
                showUserMenu={showUserMenu}
                setShowUserMenu={setShowUserMenu}
              />
            )}
          </div>
       </div>
          {/* Botón menú móvil */}
          <div className="hidden [@media(max-width:765px)]:flex w-full items-center justify-end  px-2">
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
          <div className="hidden [@media(max-width:765px)]:flex  relative w-10 h-10">
            <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors duration-200"
              >
                {user.isLoggedIn ? (
                  <img src={user.profilePic} alt="Perfil de usuario" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <UserCircle2 size={24} />
                )}
              </button>

            {showUserMenu && (
              <UserMenu
                user={user}
                showUserMenu={showUserMenu}
                setShowUserMenu={setShowUserMenu}
              />
            )}
            </div>
        </div>
      </nav>

      {/* Espaciador */}
      <div className="h-[60px] md:h-[70px]" />

      {/* Menú móvil */}
      <div
        className={`fixed top-[60px] md:top-[70px] left-0 w-full h-full bg-gray-100 shadow-lg transform transition-transform duration-100 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ zIndex: 5 }}
      >
        <div className="p-6">
          <ul className="space-y-3 mb-8">
            {/* Búsqueda móvil */}
            <li className="border-b border-gray-300 py-3 relative">
              <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white">
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Buscar..."
                  className="outline-none text-sm w-full bg-transparent"
                  onFocus={() => setShowSuggestions(true)}
                />
                {loading ? (
                  <Loader
                    size={20}
                    className="animate-spin text-gray-500 ml-2"
                  />
                ) : searchValue.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                ) : (
                  <Search size={20} className="text-gray-500 ml-2" />
                )}
              </div>

              {/* Sugerencias */}
              {showSuggestions && searchValue.length === 0 && (
                <ul className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden z-50">
                  <li className="px-4 py-2 text-gray-500 font-bold">
                    Sugerencias:
                  </li>
                  {searchSuggestions.map((suggestion, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className="w-full text-left block px-4 py-2 hover:bg-gray-100"
                      >
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Resultados búsqueda móvil */}
              {searchValue.length > 0 && (
                <ul className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden z-50">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={item.path}
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={toggleMenu}
                        >
                          {highlightMatch(item.name, debouncedSearchValue)}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500 italic">
                      No se encontraron resultados.
                    </li>
                  )}
                </ul>
              )}
            </li>

            {/* Home móvil */}
            <li className="flex flex-col border-b border-gray-300 py-3">
              <Link
                to="/"
                className="text-gray-800 hover:text-gray-900 transition-colors duration-200"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>

            {/* Checklist móvil */}
            <li className="flex flex-col border-b border-gray-300 py-3">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleSubMenu("example")}
              >
                <div className="text-gray-800">Checklist</div>
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
                    <Link
                      to="/nCheck"
                      className="block text-gray-600 hover:text-gray-800"
                      onClick={toggleMenu}
                    >
                      Nuevo checklist
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/hCheck"
                      className="block text-gray-600 hover:text-gray-800"
                      onClick={toggleMenu}
                    >
                      Historial de checklists
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cPLant"
                      className="block text-gray-600 hover:text-gray-800"
                      onClick={toggleMenu}
                    >
                      Crear plantilla
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/gPLant"
                      className="block text-gray-600 hover:text-gray-800"
                      onClick={toggleMenu}
                    >
                      Gestión de plantillas
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
