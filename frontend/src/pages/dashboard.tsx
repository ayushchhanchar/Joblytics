import { useNavigate } from "react-router-dom"; // or 'next/router' for Next.js

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto mt-20 px-6">
      <h1 className="text-3xl font-bold text-center mb-10">Welcome to Joblytics Pro</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          className="cursor-pointer border p-6 rounded-xl shadow hover:shadow-lg transition"
          onClick={() => navigate("/track")}
        >
          <h2 className="text-xl font-semibold mb-2">📊 Track Applications</h2>
          <p className="text-gray-600">
            View, update, and manage all your job applications in one place.
          </p>
        </div>

        <div
          className="cursor-pointer border p-6 rounded-xl shadow hover:shadow-lg transition"
          onClick={() => navigate("/resume-ats")}
        >
          <h2 className="text-xl font-semibold mb-2">📄 Resume ATS Analyzer</h2>
          <p className="text-gray-600">
            Upload your resume to analyze it for ATS-friendliness and keyword matches.
          </p>
        </div>
      </div>
    </div>
  );
}
