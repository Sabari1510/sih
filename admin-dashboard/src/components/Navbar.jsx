export default function Navbar() {
    return (
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">🌊 Ocean Hazard Dashboard</h1>
        <div>
          <button className="bg-white text-blue-600 px-3 py-1 rounded">Logout</button>
        </div>
      </nav>
    );
  }
  