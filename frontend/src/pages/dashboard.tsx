import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ApplicationsTable } from '../components/dashboard/ApplicationsTable';
import { ResumeAnalyzer } from '../components/dashboard/ResumeAnalyzer';
import { InsightsWidget } from '../components/dashboard/InsightsWidget';
import { AddApplicationModal } from '../components/AddApplicationModal';
import { EditApplicationModal } from '../components/EditApplicationModal';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  // Mock user data - in real app, this would come from auth context
  const userName = "John";

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/get-applications", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setApplications(res.data || []);
    } catch (err: any) {
      console.error("Error fetching applications:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Calculate stats from applications
  const stats = {
    totalApplications: applications.length,
    interviews: applications.filter(app => app.status === 'INTERVIEWING').length,
    offers: applications.filter(app => app.status === 'OFFER').length,
    rejected: applications.filter(app => app.status === 'REJECTED' || app.status === 'GHOSTED').length,
  };

  // Get recent applications (last 5)
  const recentApplications = applications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleAddSuccess = () => {
    fetchApplications();
  };

  const handleEditSuccess = () => {
    fetchApplications();
  };

  const handleEdit = (application: any) => {
    setSelectedApplication(application);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`http://localhost:3000/api/applications/${id}`, {
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
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {userName}! 👋</h1>
            <p className="text-muted-foreground mt-1">
              Here's your job hunt overview
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </div>

        {/* Quick Stats */}
        <section>
          <h2 className="text-lg md:text-xl font-semibold mb-4">📌 Quick Stats</h2>
          <StatsCards stats={stats} />
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Applications Table - Takes 2 columns on xl screens */}
          <div className="xl:col-span-2">
            <ApplicationsTable 
              applications={recentApplications}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddClick={() => setShowAddModal(true)}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <ResumeAnalyzer />
            <InsightsWidget />
          </div>
        </div>

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