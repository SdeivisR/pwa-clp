// src/layouts/MainLayout.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> {/* 👈 Se dibuja en todas las páginas que usen este layout */}
      <main className="flex-1 p-6">{children}</main>
      <Footer />
    </div>
  );
}
