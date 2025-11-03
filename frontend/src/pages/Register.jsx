import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";



export default function Register() {
  const [step, setStep] = useState(1);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Paso 1: verificar correo
  const checkEmail = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/api/users/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();

      if (res.ok) {
        setIsRegister(!data.exists);
        setStep(2);
      } else {
        setMessage(data.error || "Error verificando correo");
      }
    } catch {
      setMessage("Error de conexión con el servidor");
    }
  };

  // Paso 2a: registrar usuario
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Usuario registrado con éxito 🚀");
      } else {
        setMessage(data.error || "Error en el registro");
      }
    } catch {
      setMessage("Error de conexión con el servidor");
    }
  };

  // Paso 2b: login

const handleLogin = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const res = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: formData.email, 
        password: formData.password }),
    });
    
    const data = await res.json();
    console.log("📦 Respuesta cruda del backend:", data); 

    if (!res.ok) throw new Error(data.message || "Error de login");
    
    localStorage.setItem("usuario", JSON.stringify(data.user));
    console.log("📦 Usuario guardado en localStorage:", data.user);
    
    setUser(data.user);

    navigate("/home");

  } catch (err) {
    console.error("❌ Error en login:", err);
    setMessage(err.message || "Error al iniciar sesión");
  }
};


return (
  <div
    className="h-screen w-screen flex items-center justify-center bg-gray-100 bg-cover bg-center relative"
    style={{ backgroundImage: "url('./src/assets/login-bg.jpg')" }}
  >
    {/* Overlay semitransparente */}
    <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

    {/* Contenedor del formulario */}
    <div className="bg-white shadow-lg rounded-2xl p-8 sm:p-10 w-full max-w-md relative z-10">

      {/* Mensaje de error */}
      {message && (
        <p className="mb-4 text-center text-sm text-red-500">{message}</p>
      )}

      {/* Paso 1: Ingresar correo */}
      {step === 1 && (
        <form onSubmit={checkEmail} className="space-y-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Inicia sesión</h2>
          <p className="text-gray-500 text-sm">
            Ingresa tu correo electrónico para acceder
          </p>

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico o teléfono"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 transition"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Siguiente
          </button>
          <p className="text-sm text-gray-500">
            ¿No tienes una cuenta?{' '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => setStep(2)}
            >
              Crear cuenta
            </span>
          </p>
        </form>
      )}

      {/* Paso 2: Registro */}
      {step === 2 && isRegister && (
        <form onSubmit={handleRegister} className="space-y-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Crea tu cuenta</h2>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 transition"
          />

          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-5 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-900 focus:outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Crea una contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 transition"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Registrarse
            
          </button>

          <p className="text-sm text-gray-500">
            ¿Ya tienes una cuenta?{' '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => setStep(1)}
            >
              Inicia sesión
            </span>
          </p>
        </form>
      )}

      {/* Paso 2: Login */}
      {step === 2 && !isRegister && (
        <form onSubmit={handleLogin} className="space-y-6 text-center">
          {/* Cabecera con flecha moderna */}
          <div className="flex items-center justify-center relative">
            <button
              type="button"
              className="absolute left-0 text-gray-600 text-xl px-3 py-2 hover:bg-gray-200 rounded-md"
              onClick={() => setStep(1)}
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-3xl font-bold text-gray-800">Bienvenido</h2>
          </div>

          {/* Correo con check */}
          <div className="flex items-center justify-center space-x-2">
            <p className="text-gray-700">{formData.email}</p>
            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full">
              ✓
            </span>
          </div>

          {/* Texto explicativo */}
          <p className="text-gray-500 text-sm">
            Ingresa tu contraseña para verificar tu identidad
          </p>

          {/* Input contraseña */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 transition pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Iniciar Sesión
          </button>
        </form>
      )}

    </div>
  </div>
) };
