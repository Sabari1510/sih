export default function ReportCard({ report }) {
    return (
      <div className="border rounded-lg p-4 shadow-md mb-3 bg-white">
        <h2 className="font-semibold">{report.title}</h2>
        <p className="text-sm text-gray-600">{report.description}</p>
        <p className="text-xs text-gray-500">📍 {report.location}</p>
      </div>
    );
  }
  