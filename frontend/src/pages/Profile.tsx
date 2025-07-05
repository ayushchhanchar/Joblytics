import  { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import {
  Mail,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Calendar,
  Briefcase,
  FileText,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchApplications();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://joblytics.notdeveloper.in/api/userdetails', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://joblytics.notdeveloper.in/api/get-applications', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'INTERVIEWING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'OFFER':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'GHOSTED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const stats = {
    totalApplications: applications.length,
    interviews: applications.filter(app => app.status === 'INTERVIEWING').length,
    offers: applications.filter(app => app.status === 'OFFER').length,
    rejected: applications.filter(app => app.status === 'REJECTED' || app.status === 'GHOSTED').length,
  };

  const recentApplications = applications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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
            <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-1">
              Your professional profile and activity overview
            </p>
          </div>
          <Button onClick={() => navigate('/settings')} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="text-2xl">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    {user?.bio && (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {user.bio}
                      </p>
                    )}
                  </div>

                  <div className="w-full space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                    
                    {user?.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  {(user?.website || user?.linkedin || user?.github) && (
                    <>
                      <Separator />
                      <div className="w-full space-y-2">
                        {user?.website && (
                          <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-primary hover:underline"
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            <span className="truncate">Website</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                        
                        {user?.linkedin && (
                          <a
                            href={user.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-primary hover:underline"
                          >
                            <Linkedin className="h-4 w-4 mr-2" />
                            <span className="truncate">LinkedIn</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                        
                        {user?.github && (
                          <a
                            href={user.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-primary hover:underline"
                          >
                            <Github className="h-4 w-4 mr-2" />
                            <span className="truncate">GitHub</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalApplications}</div>
                    <div className="text-xs text-muted-foreground">Total Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.interviews}</div>
                    <div className="text-xs text-muted-foreground">Interviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.offers}</div>
                    <div className="text-xs text-muted-foreground">Offers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                    <div className="text-xs text-muted-foreground">Rejected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity and Applications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Applications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Recent Applications
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate('/track')}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {recentApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No applications yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => navigate('/track')}
                    >
                      Add Your First Application
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{application.role}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {application.company} • {application.location}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(application.status)} text-xs`}>
                            {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
                          </Badge>
                          {application.jobUrl && (
                            <a
                              href={application.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resume Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Resume Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {user?.resumeUrl ? 'Resume Uploaded' : 'No Resume Uploaded'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.resumeUrl 
                        ? 'Your resume is ready for ATS analysis'
                        : 'Upload your resume to get ATS compatibility insights'
                      }
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/resume-ats')}
                  >
                    {user?.resumeUrl ? 'Analyze Resume' : 'Upload Resume'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user?.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user?.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Password Last Changed</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.passwordUpdatedAt 
                        ? new Date(user.passwordUpdatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Never'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Account Status</p>
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}