function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Mi App PWA</h1>
      <ul className="flex gap-4">
        <li><a href="/" className="hover:text-yellow-300">Home</a></li>
        <li><a href="/about" className="hover:text-yellow-300">About</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
