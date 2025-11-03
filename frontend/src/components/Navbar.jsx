import { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { UserContext } from "../context/UserContext";
import { ChevronDown, UserCircle2, Home, Plus, FilePlus } from "lucide-react";
import UserMenuDesktop from "./UserMenuDesktop";
import UserMenuMobile from "./UserMenuMobile";

export default function Navbar() {
  const [openChecklist, setOpenChecklist] = useState(false);  
  const [showUserMenuDesktop, setShowUserMenuDesktop] = useState(false);
  const [showUserMenuMobile, setShowUserMenuMobile] = useState(false);
  const { user } = useContext(UserContext);

  const userButtonDesktopRef = useRef(null);
  const userButtonMobileRef = useRef(null);
  const userMenuDesktopRef = useRef(null);
  const userMenuMobileRef = useRef(null);
  const checklistRef = useRef(null);

  // ✅ Cerrar los menús al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      // Checklist
      if (
        checklistRef.current &&
        !checklistRef.current.contains(event.target)
      ) {
        setOpenChecklist(false);
      }

      // Desktop
      if (
        userMenuDesktopRef?.current &&
        userMenuDesktopRef.current &&
        !userMenuDesktopRef.current.contains(event.target) &&
        !userButtonDesktopRef.current?.contains(event.target)
      ) {
        setShowUserMenuDesktop(false);
      }

      // Mobile
      if (
        userMenuMobileRef?.current &&
        userMenuMobileRef.current &&
        !userMenuMobileRef.current.contains(event.target) &&
        !userButtonMobileRef.current?.contains(event.target)
      ) {
        setShowUserMenuMobile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* 🔹 NAVBAR FIJA */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-[60px] md:h-[70px]">
        <div className="flex items-center justify-between px-4 py-3 h-full">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            <img
              src="/images/logo1.png"
              alt="Group Sitem"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* 🔹 Menú escritorio */}
          <div className="hidden [@media(min-width:766px)]:flex justify-end space-x-6 text-gray-800 w-full">
            <ul className="flex items-center space-x-6 ml-auto">
              <li>
                <Link to="/Home" className="hover:text-gray-600 text-xl">
                  Home
                </Link>
              </li>

              <li className="relative flex justify-end">
                <button
                  onClick={() => setOpenChecklist(!openChecklist)}
                  className="flex items-center hover:text-gray-600 focus:outline-none text-xl"
                >
                  Checklist
                  <ChevronDown size={18} className="ml-1 text-gray-500" />
                </button>

                {openChecklist && (
                  <ul
                    ref={checklistRef}
                    className="absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300"
                  >
                    <li>
                      <Link
                        to="/nCheck"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setOpenChecklist(false)}
                      >
                        Nuevo checklist
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/hCheck"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setOpenChecklist(false)}
                      >
                        Historial de checklists
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/cPlant"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setOpenChecklist(false)}
                      >
                        Crear plantilla
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/gPlant"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setOpenChecklist(false)}
                      >
                        Gestión de plantillas
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>

            {/* 🔹 Botón usuario escritorio */}
            <div className="flex items-center relative">
              <button
                ref={userButtonDesktopRef}
                onClick={() => setShowUserMenuDesktop((prev) => !prev)}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white 
                          bg-gradient-to-br from-blue-600 to-blue-800 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Perfil de usuario"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user?.nombre?.charAt(0).toUpperCase() || (
                    <UserCircle2 size={24} />
                  )
                )}
              </button>

              {showUserMenuDesktop && (
                <div ref={userMenuDesktopRef}>
                  <UserMenuDesktop setShowUserMenu={setShowUserMenuDesktop} />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 🔹 Menú móvil inferior */}
      <div className="hidden [@media(max-width:765px)]:flex fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md justify-around items-center py-2 z-50">
        <Link
          to="/nCheck"
          className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs mt-1">Checklist</span>
        </Link>

        <Link
          to="/cPlant"
          className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition"
        >
          <FilePlus className="w-6 h-6" />
          <span className="text-xs mt-1">Plantillas</span>
        </Link>

        <Link
          to="/Home"
          className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        {/* 🔹 Botón usuario móvil */}
          <div className="flex md:hidden items-center relative">
            <button
              ref={userButtonMobileRef}
              onClick={() => setShowUserMenuMobile((prev) => !prev)}
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white 
                        bg-gradient-to-br from-blue-600 to-blue-800 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Perfil de usuario"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user?.nombre?.charAt(0).toUpperCase() || (
                  <UserCircle2 size={24} />
                )
              )}
            </button>

            {showUserMenuMobile && (
              <>
                <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={() => setShowUserMenuMobile(false)} // Cierra al tocar fuera
                ></div>
                <div ref={userMenuMobileRef}>
                  <UserMenuMobile setShowUserMenu={setShowUserMenuMobile} />
                </div>
              </>
            )}
          </div>
      </div>

      {/* Espaciador para evitar solapamiento */}
      <div className="h-[60px] md:h-[70px]" />
    </>
  );
}