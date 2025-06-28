import { useEffect, useState } from "react";
import axios from "axios";
import AddApplicationForm from "../components/AddApplicationForm";
import ApplicationTable from "../components/ApplicationTable";

export default function TrackApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchApplications = async () => {
    console.log("indside");
    try {
      const res = await axios.get("http://localhost:3000/api/get-applications", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      console.log("-------------------",res.data);
      setApplications(res.data || []);
    } catch (err: any) {
      console.error("Error fetching applications:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center mb-4">Your Job Applications</h2>

      {applications.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-gray-600">No applications yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add First Application
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {showForm ? "Close Form" : "Track New Application"}
          </button>

          <ApplicationTable applications={applications} refresh={fetchApplications} />
        </div>
      )}

      {showForm && (
        <AddApplicationForm onAdd={fetchApplications} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
