// admin-dashboard/src/pages/MapPage.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://192.168.1.47:5000/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <MapContainer center={[20, 78]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {reports.map((report, idx) => (
        <Marker key={idx} position={[report.latitude, report.longitude]}>
          <Popup>
            <img
              src={`http://192.168.1.47:5000/${report.imageUrl}`}
              alt="report"
              width="200"
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
