import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
  Download,
} from "lucide-react";
import axios from "axios";
import { ApplicationStatusLabels } from "../constants/application-status";

interface InsightData {
  timeRange: string;
  metrics: {
    totalApplications: number;
    responseRate: number;
    interviewRate: number;
    offerRate: number;
    trends: {
      applications: number;
      responseRate: number;
      interviewRate: number;
      offerRate: number;
    };
  };
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  weeklyTrend: Array<{
    week: string;
    weekStart: string;
    applications: number;
    interviews: number;
    offers: number;
  }>;
  topCompanies: Array<{
    company: string;
    count: number;
  }>;
  topLocations: Array<{
    location: string;
    count: number;
  }>;
  performanceInsights: Array<{
    type: string;
    title: string;
    description: string;
    icon: string;
  }>;
  goalProgress: {
    monthlyGoal: number;
    currentProgress: number;
    remainingDays: number;
    dailyTarget: number;
    progressPercentage: number;
    isGoalAchieved: boolean;
  };
}

export default function Insights() {
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30"); // days
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchInsights();
  }, [timeRange]);

  const fetchInsights = async () => {
    setRefreshing(true);
    setError("");
    try {
      const response = await axios.get(
        `https://joblytics.notdeveloper.in/api/insights?timeRange=${timeRange}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        setInsightData(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching insights:", error);
      setError("Failed to load insights data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get(
        "https://joblytics.notdeveloper.in/api/export-data",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `joblytics-insights-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-500";
      case "INTERVIEWING":
        return "bg-yellow-500";
      case "OFFER":
        return "bg-green-500";
      case "REJECTED":
        return "bg-red-500";
      case "GHOSTED":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const getInsightIcon = (iconName: string) => {
    switch (iconName) {
      case "trending-up":
        return <TrendingUp className="h-5 w-5" />;
      case "target":
        return <Target className="h-5 w-5" />;
      case "award":
        return <Award className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100";
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (trend < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-600";
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

  if (error || !insightData) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            {error || "No insights data available"}
          </p>
          <Button onClick={fetchInsights} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
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
            <h1 className="text-2xl md:text-3xl font-bold">
              📊 Job Search Insights
            </h1>
            <p className="text-muted-foreground mt-1">
              Analyze your job search performance and discover optimization
              opportunities
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
              onClick={fetchInsights}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
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
                  <p className="text-sm font-medium text-muted-foreground">
                    Applications
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {insightData.metrics.totalApplications}
                  </p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(insightData.metrics.trends.applications)}
                    <span
                      className={`text-sm ml-1 ${getTrendColor(
                        insightData.metrics.trends.applications
                      )}`}
                    >
                      {insightData.metrics.trends.applications > 0 ? "+" : ""}
                      {insightData.metrics.trends.applications}% vs last period
                    </span>
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
                  <p className="text-sm font-medium text-muted-foreground">
                    Response Rate
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {insightData.metrics.responseRate}%
                  </p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(insightData.metrics.trends.responseRate)}
                    <span
                      className={`text-sm ml-1 ${getTrendColor(
                        insightData.metrics.trends.responseRate
                      )}`}
                    >
                      {insightData.metrics.trends.responseRate > 0 ? "+" : ""}
                      {insightData.metrics.trends.responseRate}% vs last period
                    </span>
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
                  <p className="text-sm font-medium text-muted-foreground">
                    Interview Rate
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {insightData.metrics.interviewRate}%
                  </p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(insightData.metrics.trends.interviewRate)}
                    <span
                      className={`text-sm ml-1 ${getTrendColor(
                        insightData.metrics.trends.interviewRate
                      )}`}
                    >
                      {insightData.metrics.trends.interviewRate > 0 ? "+" : ""}
                      {insightData.metrics.trends.interviewRate}% vs last period
                    </span>
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
                  <p className="text-sm font-medium text-muted-foreground">
                    Offer Rate
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {insightData.metrics.offerRate}%
                  </p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(insightData.metrics.trends.offerRate)}
                    <span
                      className={`text-sm ml-1 ${getTrendColor(
                        insightData.metrics.trends.offerRate
                      )}`}
                    >
                      {insightData.metrics.trends.offerRate > 0 ? "+" : ""}
                      {insightData.metrics.trends.offerRate}% vs last period
                    </span>
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
                {insightData.statusDistribution.length > 0 ? (
                  insightData.statusDistribution.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(
                              item.status
                            )}`}
                          ></div>
                          <span className="text-sm font-medium">
                            {
                              ApplicationStatusLabels[
                                item.status as keyof typeof ApplicationStatusLabels
                              ]
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {item.count}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {item.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No application data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Application Trend */}
          <Card>
            {" "}
            <CardHeader>
              {" "}
              <CardTitle className="flex items-center">
                {" "}
                <Activity className="h-5 w-5 mr-2" /> Weekly Application Trend{" "}
              </CardTitle>{" "}
            </CardHeader>{" "}
            <CardContent>
              {" "}
              <div className="space-y-4">
                {" "}
                {insightData.weeklyTrend.length > 0 ? (
                  insightData.weeklyTrend.map((week, index) => (
                    <div key={index} className="space-y-2">
                      {" "}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {" "}
                        <span className="text-sm font-medium truncate max-w-[150px] sm:max-w-full">
                          {" "}
                          {week.week}{" "}
                        </span>{" "}
                        <div className="flex flex-wrap items-center gap-4">
                          {" "}
                          <div className="flex items-center gap-1">
                            {" "}
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>{" "}
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {" "}
                              {week.applications} apps{" "}
                            </span>{" "}
                          </div>{" "}
                          <div className="flex items-center gap-1">
                            {" "}
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>{" "}
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {" "}
                              {week.interviews} interviews{" "}
                            </span>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className="flex space-x-1 h-6 sm:h-8 overflow-hidden">
                        {" "}
                        <div
                          className="bg-blue-500 rounded-sm transition-all duration-300"
                          style={{
                            width: `${Math.max(
                              (week.applications /
                                Math.max(
                                  ...insightData.weeklyTrend.map(
                                    (w) => w.applications
                                  ),
                                  1
                                )) *
                                100,
                              5
                            )}%`,
                            minWidth: "5%",
                          }}
                        ></div>{" "}
                        <div
                          className="bg-yellow-500 rounded-sm transition-all duration-300"
                          style={{
                            width: `${Math.max(
                              (week.interviews /
                                Math.max(
                                  ...insightData.weeklyTrend.map(
                                    (w) => w.interviews
                                  ),
                                  1
                                )) *
                                100,
                              2
                            )}%`,
                            minWidth: "2%",
                          }}
                        ></div>{" "}
                      </div>{" "}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {" "}
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />{" "}
                    <p>No trend data available</p>{" "}
                  </div>
                )}{" "}
              </div>{" "}
            </CardContent>{" "}
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
                {insightData.topCompanies.length > 0 ? (
                  insightData.topCompanies.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
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
                {insightData.topLocations.length > 0 ? (
                  insightData.topLocations.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
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
                {insightData.performanceInsights.length > 0 ? (
                  insightData.performanceInsights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${getInsightColor(
                        insight.type
                      )}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`mt-0.5 ${
                            insight.type === "positive"
                              ? "text-green-600"
                              : insight.type === "warning"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        >
                          {getInsightIcon(insight.icon)}
                        </div>
                        <div>
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm mt-1 opacity-90">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No insights available</p>
                  </div>
                )}
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
                {insightData.goalProgress.currentProgress}/
                {insightData.goalProgress.monthlyGoal} applications
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Progress this month
                </span>
                <span className="text-sm font-medium">
                  {insightData.goalProgress.progressPercentage}% complete
                </span>
              </div>
              <Progress
                value={insightData.goalProgress.progressPercentage}
                className="h-3"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {insightData.goalProgress.isGoalAchieved
                    ? "Goal achieved! 🎉"
                    : `${
                        insightData.goalProgress.monthlyGoal -
                        insightData.goalProgress.currentProgress
                      } more to reach goal`}
                </span>
                {!insightData.goalProgress.isGoalAchieved &&
                  insightData.goalProgress.remainingDays > 0 && (
                    <span className="text-muted-foreground">
                      {insightData.goalProgress.dailyTarget} per day needed
                    </span>
                  )}
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
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={handleExportData}
              >
                <Download className="h-6 w-6" />
                <span className="text-sm">Export Data</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Target className="h-6 w-6" />
                <span className="text-sm">Set Goals</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule Review</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
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
