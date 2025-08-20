import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { ChevronRight, ChevronDown, Search, X, Loader, UserCircle2, Settings } from "lucide-react";

// Datos de ejemplo para la búsqueda. En un proyecto real, esto vendría de una API.
const allItems = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "Sobre", path: "/sobre" },
  { id: 3, name: "Example 1", path: "/example/1" },
  { id: 4, name: "Example 2", path: "/example/2" },
  { id: 5, name: "Example 3", path: "/example/3" },
  { id: 6, name: "Misión", path: "/sobre/mision" },
  { id: 7, name: "Equipo", path: "/sobre/equipo" },
  { id: 8, name: "Contáctanos", path: "/contact" },
];

// Sugerencias de búsqueda comunes
const searchSuggestions = [
  "Example 1",
  "Misión",
  "Equipo",
  "Contacto",
];

// Hook personalizado para implementar 'debounce'
// Retrasa la actualización del valor hasta que el usuario deja de escribir.
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
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
  
  ///

  //
    // Nuevo estado para simular el usuario. En un proyecto real, esto vendría de un contexto o API de autenticación.
  const [user, setUser] = useState({
    isLoggedIn: true,
    name: "Deiv",
    email: "sdeivisr@gmail.com",
    profilePic: "https://placehold.co/100x100/0D0D0D  /FFFFFF?text=DS",
  });

  // Usa el hook 'useDebounce' para retrasar la búsqueda
  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Efecto que se ejecuta cada vez que el valor de búsqueda "debounced" cambia
  useEffect(() => {
    if (debouncedSearchValue.length > 0) {
      setLoading(true);
      // Simula una búsqueda. En un proyecto real, aquí llamarías a una API.
      setTimeout(() => {
        const results = allItems.filter(item =>
          item.name.toLowerCase().includes(debouncedSearchValue.toLowerCase())
        );
        setFilteredItems(results);
        setLoading(false);
      }, 500); // Retraso simulado
      setShowSuggestions(false);
    } else {
      setFilteredItems([]);
      setLoading(false);
    }
  }, [debouncedSearchValue]);

  // Función para resaltar el texto coincidente en los resultados
  const highlightMatch = (text, highlight) => {
    if (!highlight) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="font-bold text-blue-600 bg-yellow-200">
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
    if (isOpen) {
      setActiveMenu(null);
    }
  };

  const handleSubMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
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
     
      {/* Navbar fija en la parte superior */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-[60px] md:h-[70px]">
        <div className="flex items-center justify-between px-4 py-3 h-full">
          <Link to="/" className="text-xl font-bold">
            Group Sitem
          </Link>
          {/* Menú de escritorio (visible en pantallas grandes) */}
          <div className="hidden [@media(min-width:766px)]:flex justify-end space-x-6 text-gray-800 w-full">
            <ul className="flex items-center space-x-6 ml-auto"> 

          {/* Barra de búsqueda con autocompletado y resultados */}
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
                  <Loader size={20} className="animate-spin text-gray-500 ml-2" />
                ) : (
                  <>
                    {searchValue.length > 0 ? (
                      <button type="button" onClick={handleClearSearch} className="ml-2 text-gray-500 hover:text-gray-700">
                        <X size={20} />
                      </button>
                    ) : (
                      <Search size={20} className="text-gray-500 ml-2" />
                    )}
                  </>
                )}
              </div>

              {/* Resultados de la búsqueda */}
              {searchValue.length > 0 && (
                <ul className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden z-50">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <li key={item.id}>
                        <Link to={item.path} className="block px-4 py-2 hover:bg-gray-100" onClick={handleClearSearch}>
                          {highlightMatch(item.name, debouncedSearchValue)}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500 italic">No se encontraron resultados.</li>
                  )}
                </ul>
              )}
            </div>


              <li>
                <Link to="/" className="hover:text-gray-600 text-xl ">Home</Link>
              </li>

              <li className="relative flex justify-end">
                <button
                  onClick={() => handleSubMenu("Checklist")}
                  className="flex items-center hover:text-gray-600 focus:outline-none text-xl"
                >
                  Checklist
                  <ChevronDown size={18} className="ml-1 text-gray-500" />
                </button>
                <ul
                  className={`absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 ${
                    activeMenu === "Checklist"
                      ? "visible opacity-100 scale-100"
                      : "invisible opacity-0 scale-95"
                  }`}
                >
                  <li><Link to="/nCheck" className="block px-4 py-2 hover:bg-gray-100" onClick={() => handleSubMenu(null)}>Nuevo checklist</Link></li>
                  <li><Link to="/hCheck" className="block px-4 py-2 hover:bg-gray-100" onClick={() => handleSubMenu(null)}>Historial de checklists</Link></li>
                  <li><Link to="/cPLant" className="block px-4 py-2 hover:bg-gray-100" onClick={() => handleSubMenu(null)}>Crear plantilla</Link></li>
                  <li><Link to="/gPLant" className="block px-4 py-2 hover:bg-gray-100" onClick={() => handleSubMenu(null)}>Gestión de plantillas</Link></li>
                </ul>
              </li>
            </ul>
                           {/* Menú de usuario en escritorio */}
            <div className="relative ml-auto px-4">
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
              {/*/ menu desplegable*/}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-gray-800 text-gray-100 shadow-xl rounded-2xl overflow-hidden z-50 p-4">
                  <div className="flex items-center justify-between pb-4">
                    <span className="text-sm font-semibold">
                      {user.email}
                    </span>

                    {/* Contenedor de los botones de la esquina superior derecha */}
                    <div className="flex space-x-2">
                      {/* Botón de configuración con icono. Se cambió el color a un azul claro. */}
                      <button
                        onClick={() => {
                          // Llama a la función de navegación y cierra el menú
                          handleNavigation('/');
                        }}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label="Configuración"
                      >
                        <Settings size={20} className="text-sky-400" />
                      </button>
                      {/* Botón para cerrar el menú */}
                      <button
                        onClick={() => setShowUserMenu(false)}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label="Cerrar menú"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>


                  <div className="flex flex-col items-center justify-center text-center py-4 border-b border-gray-600">
                    {user.isLoggedIn ? (
                      <img src={user.profilePic} alt="Perfil de usuario" className="w-20 h-20 rounded-full mb-2 object-cover" />
                    ) : (
                      <UserCircle2 size={40} className="text-gray-400 mb-2" />
                    )}
                    <h3 className="text-xl font-bold">Hi, {user.name}!</h3>
                      <div className="mt-4 flex flex-col space-y-2 w-full">
                        <button 
                        onClick={() => window.open('https://myaccount.google.com/', '_blank')}
                        className="px-4 py-2 text-sm font-semibold text-gray-800 bg-white rounded-full hover:bg-gray-200 transition-colors duration-200">
                          Manage your Google Account
                        </button>
                        <button className="px-4 py-2 text-sm font-semibold text-gray-800 bg-white rounded-full hover:bg-gray-200 transition-colors duration-200">
                          Gestión de usuarios
                        </button>
                      </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-600">
                  {/* Placeholder para otras opciones */}
                                <div className="flex items-center space-x-3 text-gray-200 hover:text-white mb-2 cursor-pointer transition-colors duration-200">
                                  <Settings size={20} />
                                  <span>Soporte / Contacto</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-200 hover:text-white cursor-pointer transition-colors duration-200">
                                  <X size={20} />
                                  <span>Ayuda / Acerca de</span>
                                </div>
                              </div>

                              <div className="flex justify-center mt-4">
                                <button className="px-4 py-2 text-sm font-semibold text-gray-800 bg-white rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={() => {
                                  console.log("Cerrando sesión...");
                                  setShowUserMenu(false);
                                }}>
                                  <span className="text-sm">Sign out</span>
                                </button>
                              </div>
                  </div>
              )}
            </div>
          </div>
 
          
          {/* Botón para el menú móvil (visible en pantallas pequeñas) */}
          <div className="hidden [@media(max-width:765px)]:flex flex items-center justify-between px-2">
            <button
              onClick={toggleMenu}
              className={`hamburger-button ${isOpen ? "open" : ""}`}
            >
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </button>
            {/* Menú de usuario en escritorio */}
            <div className="relative ml-4">
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
              {/*/ menu desplegable*/}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-gray-800 text-gray-100 shadow-xl rounded-2xl overflow-hidden z-50 p-4">
                  <div className="flex items-center justify-between pb-4">
                    <span className="text-sm font-semibold">
                      {user.email}
                    </span>

                    {/* Contenedor de los botones de la esquina superior derecha */}
                    <div className="flex space-x-2">
                      {/* Botón de configuración con icono. Se cambió el color a un azul claro. */}
                      <button
                        onClick={() => {
                          // Llama a la función de navegación y cierra el menú
                          handleNavigation('/');
                        }}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label="Configuración"
                      >
                        <Settings size={20} className="text-sky-400" />
                      </button>
                      {/* Botón para cerrar el menú */}
                      <button
                        onClick={() => setShowUserMenu(false)}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label="Cerrar menú"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>


                  <div className="flex flex-col items-center justify-center text-center py-4 border-b border-gray-600">
                    {user.isLoggedIn ? (
                      <img src={user.profilePic} alt="Perfil de usuario" className="w-20 h-20 rounded-full mb-2 object-cover" />
                    ) : (
                      <UserCircle2 size={40} className="text-gray-400 mb-2" />
                    )}
                    <h3 className="text-xl font-bold">Hi, {user.name}!</h3>
                      <div className="mt-4 flex flex-col space-y-2 w-full">
                        <button 
                        onClick={() => window.open('https://myaccount.google.com/', '_blank')}
                        className="px-4 py-2 text-sm font-semibold text-gray-800 bg-white rounded-full hover:bg-gray-200 transition-colors duration-200">
                          Manage your Google Account
                        </button>
                        <button className="px-4 py-2 text-sm font-semibold text-gray-800 bg-white rounded-full hover:bg-gray-200 transition-colors duration-200">
                          Gestión de usuarios
                        </button>
                      </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-600">
                  {/* Placeholder para otras opciones */}
                                <div className="flex items-center space-x-3 text-gray-200 hover:text-white mb-2 cursor-pointer transition-colors duration-200">
                                  <Settings size={20} />
                                  <span>Soporte / Contacto</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-200 hover:text-white cursor-pointer transition-colors duration-200">
                                  <X size={20} />
                                  <span>Ayuda / Acerca de</span>
                                </div>
                              </div>

                              <div className="flex justify-center mt-4">
                                <button className="px-4 py-2 text-sm font-semibold text-gray-800 bg-white rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={() => {
                                  console.log("Cerrando sesión...");
                                  setShowUserMenu(false);
                                }}>
                                  <span className="text-sm">Sign out</span>
                                </button>
                              </div>
                  </div>
              )}
            </div>
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
            {/* Barra de búsqueda para móvil con sugerencias */}
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
                  <Loader size={20} className="animate-spin text-gray-500 ml-2" />
                ) : (
                  <>
                    {searchValue.length > 0 ? (
                      <button type="button" onClick={handleClearSearch} className="ml-2 text-gray-500 hover:text-gray-700">
                        <X size={20} />
                      </button>
                    ) : (
                      <Search size={20} className="text-gray-500 ml-2" />
                    )}
                  </>
                )}
              </div>
              
              {/* Sugerencias de búsqueda para móvil */}
              {showSuggestions && searchValue.length === 0 && (
                <ul className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden z-50">
                  <li className="px-4 py-2 text-gray-500 font-bold">Sugerencias:</li>
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

              {/* Resultados de la búsqueda para móvil */}
              {searchValue.length > 0 && (
                <ul className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden z-50">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <li key={item.id}>
                        <Link to={item.path} className="block px-4 py-2 hover:bg-gray-100" onClick={toggleMenu}>
                          {highlightMatch(item.name, debouncedSearchValue)}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500 italic">No se encontraron resultados.</li>
                  )}
                </ul>
              )}
            </li>

            {/* Elemento de acordeón para "Sobre" en móvil */}
            <li className="flex flex-col border-b border-gray-300 py-3">
              <Link to="/"className="text-gray-800 hover:text-gray-900 transition-colors duration-200" onClick={toggleMenu}>Home</Link>
            </li>


            {/* Elemento de acordeón para "Example" en móvil */}
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
                  <li><Link to="/nCheck" className="block text-gray-600 hover:text-gray-800" onClick={toggleMenu}>Nuevo checklist</Link></li>
                  <li><Link to="/hCheck" className="block text-gray-600 hover:text-gray-800" onClick={toggleMenu}>Historial de checklists</Link></li>
                  <li><Link to="/cPLant" className="block text-gray-600 hover:text-gray-800" onClick={toggleMenu}>Crear plantilla</Link></li>
                  <li><Link to="/gPLant" className="block text-gray-600 hover:text-gray-800" onClick={toggleMenu}>Gestión de plantillas</Link></li>
                
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>

         
    </>
  );
}
