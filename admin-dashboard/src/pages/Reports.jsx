import { useEffect, useState } from "react";
import ReportCard from "../components/ReportCard";

export default function Reports() {
  const [reports, setReports] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then(setReports)
      .catch(() => setReports([]));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Pinned Photos</h1>
      {reports.length === 0 && <p>No reports found.</p>}
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
