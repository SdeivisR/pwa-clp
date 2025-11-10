import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-gray-200 py-4 mt-8">
      <div className="container mx-auto px-6 flex flex-wrap justify-center items-center gap-6 text-center">
        {/* 💬 Texto */}
        <p className="text-sm sm:text-base font-medium">
          © {new Date().getFullYear()} <span className="font-semibold text-white">By Deiv</span>. Todos los derechos reservados.
        </p>

        {/* 🌐 Iconos sociales */}
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/SdeivisR"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform duration-200 hover:text-white"
          >
            <Github className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/deivis-mijael-surichaqui-9557b2391/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform duration-200 hover:text-white"
          >
            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a
            href="mailto:sdeivisr@gmail.com?subject=Soporte%20técnico&body=Hola%20Deivis,"
            className="hover:scale-110 transition-transform duration-200 hover:text-white"
          >
            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        </div>
      </div>

      {/* ✨ Línea decorativa inferior */}
      <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-gray-400/30 to-transparent" />
    </footer>
  );
}
