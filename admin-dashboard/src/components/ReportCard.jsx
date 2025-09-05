
export default function ReportCard({ report }) {
  return (
    <div className="border rounded-lg p-4 shadow-md mb-3 bg-white">
      <h2 className="font-semibold">{report.title || report.type}</h2>
      <p className="text-sm text-gray-600">{report.description}</p>
      <p className="text-xs text-gray-500">📍 {report.location || `${report.latitude}, ${report.longitude}`}</p>
      {Array.isArray(report.imageUrls) && report.imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {report.imageUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Pinned ${idx + 1}`}
              className="w-32 h-32 object-cover rounded border"
            />
          ))}
        </div>
      )}
    </div>
  );
}
  