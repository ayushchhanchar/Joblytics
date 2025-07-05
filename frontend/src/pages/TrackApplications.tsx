import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ApplicationsTable } from "../components/dashboard/ApplicationsTable";
import { StatsCards } from "../components/dashboard/StatsCards";
import { AddApplicationModal } from "../components/AddApplicationModal";
import { EditApplicationModal } from "../components/EditApplicationModal";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Plus, Filter, Search, X } from "lucide-react";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ApplicationStatusLabels } from "../constants/application-status";

export default function TrackApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchApplications = async () => {
    try {
      const res = await axios.get("https://joblytics.notdeveloper.in/get-applications", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setApplications(res.data || []);
      setFilteredApplications(res.data || []);
    } catch (err: any) {
      console.error("Error fetching applications:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter applications based on search and status
  useEffect(() => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  // Calculate stats
  const stats = {
    totalApplications: applications.length,
    interviews: applications.filter(app => app.status === 'INTERVIEWING').length,
    offers: applications.filter(app => app.status === 'OFFER').length,
    rejected: applications.filter(app => app.status === 'REJECTED' || app.status === 'GHOSTED').length,
  };

  const handleEdit = (application: any) => {
    setSelectedApplication(application);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`https://joblytics.notdeveloper.in/applications/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        fetchApplications();
      } catch (err: any) {
        console.error("Error deleting application:", err.response?.data || err.message);
      }
    }
  };

  const handleAddSuccess = () => {
    fetchApplications();
  };

  const handleEditSuccess = () => {
    fetchApplications();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Job Applications</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage all your job applications
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by company, role, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px] justify-between">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span className="truncate">
                        {statusFilter === "all" ? "All Status" : ApplicationStatusLabels[statusFilter as keyof typeof ApplicationStatusLabels]}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All Status
                  </DropdownMenuItem>
                  {Object.entries(ApplicationStatusLabels).map(([key, label]) => (
                    <DropdownMenuItem key={key} onClick={() => setStatusFilter(key)}>
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Status Filter Badges */}
            {statusFilter !== "all" && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Filtered by:</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  {ApplicationStatusLabels[statusFilter as keyof typeof ApplicationStatusLabels]}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </div>
            )}

            <ApplicationsTable
              applications={filteredApplications}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddClick={() => setShowAddModal(true)}
            />
          </CardContent>
        </Card>

        {/* Add Application Modal */}
        <AddApplicationModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
          onSuccess={handleAddSuccess}
        />

        {/* Edit Application Modal */}
        <EditApplicationModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onSuccess={handleEditSuccess}
          application={selectedApplication}
        />
      </div>
    </DashboardLayout>
  );
}