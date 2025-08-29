// UserMenu.js
import { Link } from 'react-router-dom';
import { Settings, X, UserCircle2 } from 'lucide-react';
import { forwardRef } from "react";


const UserMenu = forwardRef(({ user, setShowUserMenu }, ref) => {

  return (
    <div 
    ref={ref}
    className={`absolute right-0 top-full mt-2 mr-1 w-72 bg-white text-gray-800 shadow-xl rounded-2xl overflow-hidden z-50 p-4 border border-gray-200`}>
      <div className="flex items-center justify-between pb-4">
        <span className="text-sm font-semibold">{user.email}</span>
        <div className="flex space-x-2">
          <Link
            to="/configuracion"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Configuración"
            onClick={() => setShowUserMenu(false)} // Cierra el menú al navegar
          >
            <Settings size={20} />
          </Link>
          <button
            onClick={() => setShowUserMenu(false)}
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-4">
        {user.isLoggedIn ? (
          <img src={user.profilePic} alt="Perfil de usuario" className="w-20 h-20 rounded-full mb-2 object-cover" />
        ) : (
          <UserCircle2 size={40} className="text-gray-400 mb-2" />
        )}
        <h3 className="text-xl font-bold">¡Hola, {user.name}!</h3>
        <div className="mt-4 flex flex-col space-y-2 w-full">
          <button 
            onClick={() => window.open('https://myaccount.google.com/', '_blank')}
            className="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200"
          >
            Gestionar tu cuenta de Google
          </button>
          {user.role === "admin" && (
            <Link 
              to="/users"
              className="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200"
            >
              Gestión de usuarios
            </Link>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-600">
        <Link
          to="/soporte"
          className="flex items-center space-x-3 text-gray-600 hover:text-black mb-2 transition-colors"
          onClick={() => setShowUserMenu(false)}
        >
          <Settings size={20} />
          <span>Soporte / Contacto</span>
        </Link>
        <Link
          to="/acerca"
          className="flex items-center space-x-3 text-gray-600 hover:text-black mb-2 transition-colors"
          onClick={() => setShowUserMenu(false)}
        >
          <X size={20} />
          <span>Ayuda / Acerca de</span>
        </Link>
      </div>

      <div className="flex justify-center mt-4">
        <button className="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200" onClick={() => {
          console.log("Cerrando sesión...");
          setShowUserMenu(false);
        }}>
          <span className="text-sm">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
});

export default UserMenu;
