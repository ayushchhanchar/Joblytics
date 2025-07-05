import { ApplicationStatusList, ApplicationStatusLabels } from "../constants/application-status";
import axios from "axios";
import { useState } from "react";

type Application = {
  id: string;
  company: string;
  role: string;
  location: string;
  jobUrl: string;
  appliedAt?: string;
  status: keyof typeof ApplicationStatusLabels;
};

export default function ApplicationTable({
  applications,
  refresh,
}: {
  applications: Application[];
  refresh: () => void;
}) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: Application["status"]) => {
    try {
      setUpdatingId(id);
      await axios.patch(`http://joblytics.notdeveloper.in/api/applications/${id}`, { status: newStatus }, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      refresh();
    } catch (err: any) {
      console.error("Failed to update status:", err.response?.data || err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-auto rounded shadow border">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-2">Company</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Applied</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-2 font-medium">{app.company}</td>
              <td className="px-4 py-2">{app.role}</td>
              <td className="px-4 py-2">{app.location}</td>
              <td className="px-4 py-2">
                {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "-"}
              </td>
              <td className="px-4 py-2">
                <select
                  disabled={updatingId === app.id}
                  className="border rounded px-2 py-1"
                  value={app.status}
                  onChange={(e) =>
                    handleStatusChange(app.id, e.target.value as Application["status"])
                  }
                >
                  {ApplicationStatusList.map((status) => (
                    <option key={status} value={status}>
                      {ApplicationStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
