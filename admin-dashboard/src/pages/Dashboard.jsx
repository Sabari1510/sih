
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";
import ReportCard from "../components/ReportCard";
import { useEffect, useState, useMemo } from "react";

function groupReports(reports, precision = 0.05) {
  // Group by rounded lat/lng
  const groups = {};
  for (const r of reports) {
    const lat = Math.round(r.latitude / precision) * precision;
    const lng = Math.round(r.longitude / precision) * precision;
    const key = `${lat},${lng}`;
    if (!groups[key]) groups[key] = { lat, lng, reports: [] };
    groups[key].reports.push(r);
  }
  return Object.values(groups);
}

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then(setReports)
      .catch(() => setReports([]));
  }, []);

  const grouped = useMemo(() => groupReports(reports), [reports]);

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
            {grouped.map((group, idx) => {
              const count = group.reports.length;
              let color = "blue";
              if (count >= 10) color = "red";
              else if (count >= 2) color = "yellow";
              return (
                <>
                  <Circle
                    key={`circle-${idx}`}
                    center={[group.lat, group.lng]}
                    radius={5000}
                    pathOptions={{ color, fillColor: color, fillOpacity: 0.3 }}
                  />
                  {group.reports.map((r) => (
                    <Marker key={r.id} position={[r.latitude, r.longitude]}>
                      <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                        <div style={{ maxWidth: 180 }}>
                          <b>{r.title || r.type}</b><br />
                          {r.description}<br />
                          📍 {r.location || `${r.latitude}, ${r.longitude}`}
                          {Array.isArray(r.imageUrls) && r.imageUrls.length > 0 && (
                            <img
                              src={r.imageUrls[0]}
                              alt="preview"
                              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, marginTop: 4 }}
                            />
                          )}
                        </div>
                      </Tooltip>
                      <Popup>
                        <b>{r.title || r.type}</b>
                        <br />
                        {r.description}
                        <br />
                        📍 {r.location || `${r.latitude}, ${r.longitude}`}
                        {Array.isArray(r.imageUrls) && r.imageUrls.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            {r.imageUrls.map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt={`Report ${i + 1}`}
                                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginRight: 4, cursor: "pointer" }}
                                onMouseOver={e => e.currentTarget.style.boxShadow = "0 0 8px #333"}
                                onMouseOut={e => e.currentTarget.style.boxShadow = "none"}
                                onClick={e => {
                                  const img = document.createElement('img');
                                  img.src = url;
                                  img.style.position = 'fixed';
                                  img.style.top = '50%';
                                  img.style.left = '50%';
                                  img.style.transform = 'translate(-50%, -50%)';
                                  img.style.maxWidth = '90vw';
                                  img.style.maxHeight = '90vh';
                                  img.style.zIndex = 9999;
                                  img.style.background = '#fff';
                                  img.style.borderRadius = '12px';
                                  img.style.boxShadow = '0 0 24px #333';
                                  img.onclick = () => document.body.removeChild(img);
                                  document.body.appendChild(img);
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </Popup>
                    </Marker>
                  ))}
                </>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
