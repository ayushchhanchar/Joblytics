import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Clock,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Users,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import axios from 'axios';
import { ApplicationStatusLabels } from '../constants/application-status';

interface InsightData {
  applications: any[];
  timeRange: string;
}

export default function Insights() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get('https://joblytics.notdeveloper.in/api/get-applications', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter applications by time range
  const filteredApplications = applications.filter(app => {
    const appDate = new Date(app.appliedAt);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
    return appDate >= cutoffDate;
  });

  // Calculate metrics
  const metrics = {
    totalApplications: filteredApplications.length,
    responseRate: filteredApplications.length > 0 
      ? Math.round((filteredApplications.filter(app => 
          ['INTERVIEWING', 'OFFER'].includes(app.status)).length / filteredApplications.length) * 100)
      : 0,
    interviewRate: filteredApplications.length > 0
      ? Math.round((filteredApplications.filter(app => app.status === 'INTERVIEWING').length / filteredApplications.length) * 100)
      : 0,
    offerRate: filteredApplications.length > 0
      ? Math.round((filteredApplications.filter(app => app.status === 'OFFER').length / filteredApplications.length) * 100)
      : 0,
    avgResponseTime: 7, // Mock data - would calculate from actual response times
    topCompanies: getTopCompanies(filteredApplications),
    topLocations: getTopLocations(filteredApplications),
    statusDistribution: getStatusDistribution(filteredApplications),
    weeklyTrend: getWeeklyTrend(filteredApplications),
    monthlyGoal: 20, // Mock goal
  };

  function getTopCompanies(apps: any[]) {
    const companyCounts = apps.reduce((acc, app) => {
      acc[app.company] = (acc[app.company] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(companyCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([company, count]) => ({ company, count }));
  }

  function getTopLocations(apps: any[]) {
    const locationCounts = apps.reduce((acc, app) => {
      acc[app.location] = (acc[app.location] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(locationCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));
  }

  function getStatusDistribution(apps: any[]) {
    const statusCounts = apps.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round(((count as number) / apps.length) * 100) || 0,
    }));
  }

  function getWeeklyTrend(apps: any[]) {
    const weeks = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekApps = apps.filter(app => {
        const appDate = new Date(app.appliedAt);
        return appDate >= weekStart && appDate <= weekEnd;
      });
      
      weeks.push({
        week: `Week ${7 - i}`,
        applications: weekApps.length,
        interviews: weekApps.filter(app => app.status === 'INTERVIEWING').length,
      });
    }
    
    return weeks;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-500';
      case 'INTERVIEWING':
        return 'bg-yellow-500';
      case 'OFFER':
        return 'bg-green-500';
      case 'REJECTED':
        return 'bg-red-500';
      case 'GHOSTED':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return <Clock className="h-4 w-4" />;
      case 'INTERVIEWING':
        return <Users className="h-4 w-4" />;
      case 'OFFER':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      case 'GHOSTED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
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
            <h1 className="text-2xl md:text-3xl font-bold">📊 Job Search Insights</h1>
            <p className="text-muted-foreground mt-1">
              Analyze your job search performance and discover optimization opportunities
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchApplications}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applications</p>
                  <p className="text-3xl font-bold text-blue-600">{metrics.totalApplications}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+12% vs last period</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                  <p className="text-3xl font-bold text-green-600">{metrics.responseRate}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+5% vs last period</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interview Rate</p>
                  <p className="text-3xl font-bold text-yellow-600">{metrics.interviewRate}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-sm text-red-600">-2% vs last period</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offer Rate</p>
                  <p className="text-3xl font-bold text-purple-600">{metrics.offerRate}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+3% vs last period</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Application Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Application Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.statusDistribution.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></div>
                        <span className="text-sm font-medium">
                          {ApplicationStatusLabels[item.status as keyof typeof ApplicationStatusLabels]}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{item.count}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Application Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Weekly Application Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.weeklyTrend.map((week, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{week.week}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">
                            {week.applications} apps
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">
                            {week.interviews} interviews
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1 h-8">
                      <div 
                        className="bg-blue-500 rounded-sm flex-shrink-0 transition-all duration-300"
                        style={{ width: `${Math.max((week.applications / Math.max(...metrics.weeklyTrend.map(w => w.applications))) * 100, 5)}%` }}
                      ></div>
                      <div 
                        className="bg-yellow-500 rounded-sm flex-shrink-0 transition-all duration-300"
                        style={{ width: `${Math.max((week.interviews / Math.max(...metrics.weeklyTrend.map(w => w.interviews))) * 100, 2)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Top Companies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Top Companies Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.topCompanies.length > 0 ? (
                  metrics.topCompanies.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {item.company.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{item.company}</span>
                      </div>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No applications yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Top Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.topLocations.length > 0 ? (
                  metrics.topLocations.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.location}</span>
                      </div>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No locations tracked</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Strong Application Volume
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        You're applying consistently. Keep up the momentum!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                        Optimize Response Rate
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Consider tailoring your resume for better ATS compatibility.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start space-x-3">
                    <Award className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100">
                        Great Interview Conversion
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Your interview skills are paying off. Keep it up!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goal Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Monthly Application Goal
              </div>
              <Badge variant="outline">
                {metrics.totalApplications}/{metrics.monthlyGoal} applications
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress this month</span>
                <span className="text-sm font-medium">
                  {Math.round((metrics.totalApplications / metrics.monthlyGoal) * 100)}% complete
                </span>
              </div>
              <Progress 
                value={(metrics.totalApplications / metrics.monthlyGoal) * 100} 
                className="h-3"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {metrics.monthlyGoal - metrics.totalApplications > 0 
                    ? `${metrics.monthlyGoal - metrics.totalApplications} more to reach goal`
                    : 'Goal achieved! 🎉'
                  }
                </span>
                <span className="text-muted-foreground">
                  {Math.ceil((metrics.monthlyGoal - metrics.totalApplications) / 
                    (30 - new Date().getDate()))} per day needed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Export Data</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Target className="h-6 w-6" />
                <span className="text-sm">Set Goals</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule Review</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Salary Insights</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}