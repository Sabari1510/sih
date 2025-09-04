import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";
import ReportCard from "../components/ReportCard";

export default function Dashboard() {
  const reports = [
    {
      id: 1,
      title: "Flooding in Chennai",
      description: "Water entered coastal homes due to high tides.",
      lat: 13.0827,
      lng: 80.2707,
      location: "Chennai, Tamil Nadu",
    },
    {
      id: 2,
      title: "High Waves in Vizag",
      description: "Fishermen reported dangerous swell surges.",
      lat: 17.6868,
      lng: 83.2185,
      location: "Visakhapatnam, Andhra Pradesh",
    },
    {
      id: 3,
      title: "Cyclone Warning in Odisha",
      description: "Strong winds observed near the coast.",
      lat: 19.8135,
      lng: 85.8312,
      location: "Puri, Odisha",
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/3 p-4 overflow-y-auto bg-gray-100">
          <h2 className="text-lg font-bold mb-3">Recent Reports</h2>
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>

        {/* Map */}
        <div className="w-2/3">
          <MapContainer center={[15, 80]} zoom={5} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {reports.map((r) => (
              <Marker key={r.id} position={[r.lat, r.lng]}>
                <Popup>
                  <b>{r.title}</b>
                  <br />
                  {r.description}
                  <br />
                  📍 {r.location}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
