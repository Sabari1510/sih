// admin-dashboard/src/pages/MapPage.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";

export default function MapPage() {
  const [reports, setReports] = useState([]);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const url = new URL("http://192.168.1.47:5000/api/reports");
    if (type) url.searchParams.set("type", type);
    if (status) url.searchParams.set("status", status);
    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error(err));
  }, [type, status]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div style={{ position: "absolute", zIndex: 1000, background: "white", padding: 8, margin: 8, borderRadius: 8 }}>
        <label style={{ marginRight: 8 }}>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ marginLeft: 6 }}>
            <option value="">All</option>
            <option value="tsunami">Tsunami</option>
            <option value="storm_surge">Storm Surge</option>
            <option value="high_waves">High Waves</option>
            <option value="swell_surge">Swell Surge</option>
            <option value="coastal_flooding">Coastal Flooding</option>
            <option value="abnormal_sea">Abnormal Sea</option>
            <option value="pollution">Pollution</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginLeft: 6 }}>
            <option value="">All</option>
            <option value="new">New</option>
            <option value="under_review">Under Review</option>
            <option value="verified">Verified</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </label>
      </div>
      <MapContainer center={[20, 78]} zoom={5} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {/* Render a marker for every report, even with identical coordinates */}
      {reports.map((report, idx) => (
        <Marker key={report.id || idx} position={[report.latitude, report.longitude]}>
          <Tooltip direction="top" offset={[0, 30]} opacity={1} permanent={false}>
            <div style={{ maxWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <b>{report.type}</b> · {report.severity}<br />
              {report.description}<br />
              📍 {report.location || `${report.latitude}, ${report.longitude}`}
              {Array.isArray(report.imageUrls) && report.imageUrls.length > 0 && (
                <img
                  src={report.imageUrls[0].startsWith('http') ? report.imageUrls[0] : `http://192.168.1.47:5000${report.imageUrls[0]}`}
                  alt="preview"
                  style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8, marginTop: 8, boxShadow: '0 2px 8px #333' }}
                />
              )}
            </div>
          </Tooltip>
          <Popup>
            <div style={{ maxWidth: 220 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{report.type} · {report.severity}</div>
              {Array.isArray(report.imageUrls) && report.imageUrls.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {report.imageUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url.startsWith('http') ? url : `http://192.168.1.47:5000${url}`}
                      alt={`Report ${i + 1}`}
                      width={90}
                      height={90}
                      style={{ borderRadius: 10, objectFit: 'cover', cursor: 'pointer', boxShadow: '0 2px 8px #333' }}
                      onMouseOver={e => e.currentTarget.style.boxShadow = "0 0 12px #333"}
                      onMouseOut={e => e.currentTarget.style.boxShadow = "0 2px 8px #333"}
                      onClick={e => {
                        const img = document.createElement('img');
                        img.src = url.startsWith('http') ? url : `http://192.168.1.47:5000${url}`;
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
              {report.description && <p style={{ marginTop: 6 }}>{report.description}</p>}
              <div style={{ marginTop: 6, fontSize: 12 }}>📍 {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}</div>
              <div style={{ marginTop: 4, fontSize: 12 }}>Status: {report.status}</div>
              {report.contact && <div style={{ marginTop: 4, fontSize: 12 }}>Contact: {report.contact}</div>}
              <div style={{ marginTop: 4, fontSize: 12 }}>{new Date(report.timestamp).toLocaleString()}</div>
            </div>
          </Popup>
        </Marker>
      ))}
      </MapContainer>
    </div>
  );
}
