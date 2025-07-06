import { Request, Response } from "express";
import { Client } from "../conifg/prisma";

export const getInsights = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { timeRange = '30' } = req.query; // days

    if (!userId) {
      return res.status(400).json({ error: 'User ID missing in token' });
    }

    // Calculate date range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange as string));

    // Fetch applications within time range
    const applications = await Client.application.findMany({
      where: {
        userId: userId,
        appliedAt: {
          gte: cutoffDate,
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });

    // Fetch all applications for comparison
    const allApplications = await Client.application.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });

    // Calculate previous period for comparison
    const previousPeriodStart = new Date(cutoffDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - parseInt(timeRange as string));
    
    const previousApplications = await Client.application.findMany({
      where: {
        userId: userId,
        appliedAt: {
          gte: previousPeriodStart,
          lt: cutoffDate,
        },
      },
    });

    // Calculate metrics
    const metrics = calculateMetrics(applications, previousApplications);
    const statusDistribution = calculateStatusDistribution(applications);
    const weeklyTrend = calculateWeeklyTrend(applications, parseInt(timeRange as string));
    const topCompanies = calculateTopCompanies(applications);
    const topLocations = calculateTopLocations(applications);
    const performanceInsights = generatePerformanceInsights(applications, allApplications);
    const goalProgress = calculateGoalProgress(applications);

    res.json({
      success: true,
      data: {
        timeRange,
        metrics,
        statusDistribution,
        weeklyTrend,
        topCompanies,
        topLocations,
        performanceInsights,
        goalProgress,
        totalApplications: applications.length,
        previousPeriodTotal: previousApplications.length,
      },
    });

  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ error: 'Failed to fetch insights data' });
  }
};

export const getApplicationStats = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID missing in token' });
    }

    const applications = await Client.application.findMany({
      where: {
        userId: userId,
      },
    });

    const stats = {
      total: applications.length,
      applied: applications.filter(app => app.status === 'APPLIED').length,
      interviewing: applications.filter(app => app.status === 'INTERVIEWING').length,
      offers: applications.filter(app => app.status === 'OFFER').length,
      rejected: applications.filter(app => app.status === 'REJECTED').length,
      ghosted: applications.filter(app => app.status === 'GHOSTED').length,
    };

    res.json({
      success: true,
      stats,
    });

  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({ error: 'Failed to fetch application statistics' });
  }
};

export const getResponseTimeAnalytics = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID missing in token' });
    }

    const applications = await Client.application.findMany({
      where: {
        userId: userId,
        status: {
          in: ['INTERVIEWING', 'OFFER', 'REJECTED'],
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });

    // Calculate average response times (mock calculation)
    const responseTimeData = applications.map(app => {
      const appliedDate = new Date(app.appliedAt);
      const responseDate = new Date(app.updatedAt);
      const daysDiff = Math.floor((responseDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        company: app.company,
        responseTime: Math.max(daysDiff, 1), // Minimum 1 day
        status: app.status,
      };
    });

    const avgResponseTime = responseTimeData.length > 0 
      ? Math.round(responseTimeData.reduce((sum, item) => sum + item.responseTime, 0) / responseTimeData.length)
      : 0;

    res.json({
      success: true,
      data: {
        averageResponseTime: avgResponseTime,
        responseTimeData: responseTimeData.slice(0, 10), // Last 10 responses
        fastestResponse: Math.min(...responseTimeData.map(r => r.responseTime)),
        slowestResponse: Math.max(...responseTimeData.map(r => r.responseTime)),
      },
    });

  } catch (error) {
    console.error('Get response time analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch response time analytics' });
  }
};

export const getMonthlyGoalProgress = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID missing in token' });
    }

    // Get current month applications
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyApplications = await Client.application.findMany({
      where: {
        userId: userId,
        appliedAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    // Default monthly goal (could be stored in user preferences)
    const monthlyGoal = 20;
    const currentProgress = monthlyApplications.length;
    const remainingDays = monthEnd.getDate() - now.getDate();
    const dailyTarget = remainingDays > 0 ? Math.ceil((monthlyGoal - currentProgress) / remainingDays) : 0;

    res.json({
      success: true,
      data: {
        monthlyGoal,
        currentProgress,
        remainingDays,
        dailyTarget: Math.max(dailyTarget, 0),
        progressPercentage: Math.round((currentProgress / monthlyGoal) * 100),
        isGoalAchieved: currentProgress >= monthlyGoal,
      },
    });

  } catch (error) {
    console.error('Get monthly goal progress error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly goal progress' });
  }
};

// Helper functions
function calculateMetrics(current: any[], previous: any[]) {
  const totalApplications = current.length;
  const previousTotal = previous.length;
  
  const responseCount = current.filter(app => 
    ['INTERVIEWING', 'OFFER'].includes(app.status)
  ).length;
  const responseRate = totalApplications > 0 ? Math.round((responseCount / totalApplications) * 100) : 0;
  
  const interviewCount = current.filter(app => app.status === 'INTERVIEWING').length;
  const interviewRate = totalApplications > 0 ? Math.round((interviewCount / totalApplications) * 100) : 0;
  
  const offerCount = current.filter(app => app.status === 'OFFER').length;
  const offerRate = totalApplications > 0 ? Math.round((offerCount / totalApplications) * 100) : 0;

  // Calculate trends
  const applicationsTrend = previousTotal > 0 
    ? Math.round(((totalApplications - previousTotal) / previousTotal) * 100) 
    : 0;

  const previousResponseCount = previous.filter(app => 
    ['INTERVIEWING', 'OFFER'].includes(app.status)
  ).length;
  const previousResponseRate = previousTotal > 0 ? Math.round((previousResponseCount / previousTotal) * 100) : 0;
  const responseRateTrend = previousResponseRate > 0 
    ? Math.round(((responseRate - previousResponseRate) / previousResponseRate) * 100) 
    : 0;

  return {
    totalApplications,
    responseRate,
    interviewRate,
    offerRate,
    trends: {
      applications: applicationsTrend,
      responseRate: responseRateTrend,
      interviewRate: 0, // Mock data
      offerRate: 0, // Mock data
    },
  };
}

function calculateStatusDistribution(applications: any[]) {
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: applications.length > 0 ? Math.round(((count as number) / applications.length) * 100) : 0,
  }));
}

function calculateWeeklyTrend(applications: any[], timeRange: number) {
  const weeks = [];
  const now = new Date();
  const weeksToShow = Math.min(Math.ceil(timeRange / 7), 8); // Max 8 weeks

  for (let i = weeksToShow - 1; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekApps = applications.filter(app => {
      const appDate = new Date(app.appliedAt);
      return appDate >= weekStart && appDate <= weekEnd;
    });

    weeks.push({
      week: `Week ${weeksToShow - i}`,
      weekStart: weekStart.toISOString(),
      applications: weekApps.length,
      interviews: weekApps.filter(app => app.status === 'INTERVIEWING').length,
      offers: weekApps.filter(app => app.status === 'OFFER').length,
    });
  }

  return weeks;
}

function calculateTopCompanies(applications: any[]) {
  const companyCounts = applications.reduce((acc, app) => {
    acc[app.company] = (acc[app.company] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(companyCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([company, count]) => ({ company, count }));
}

function calculateTopLocations(applications: any[]) {
  const locationCounts = applications.reduce((acc, app) => {
    acc[app.location] = (acc[app.location] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(locationCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([location, count]) => ({ location, count }));
}

function generatePerformanceInsights(current: any[], all: any[]) {
  const insights = [];

  // Application volume insight
  if (current.length >= 10) {
    insights.push({
      type: 'positive',
      title: 'Strong Application Volume',
      description: "You're applying consistently. Keep up the momentum!",
      icon: 'trending-up',
    });
  } else if (current.length < 5) {
    insights.push({
      type: 'warning',
      title: 'Increase Application Volume',
      description: 'Consider applying to more positions to improve your chances.',
      icon: 'target',
    });
  }

  // Response rate insight
  const responseRate = current.length > 0 
    ? (current.filter(app => ['INTERVIEWING', 'OFFER'].includes(app.status)).length / current.length) * 100 
    : 0;

  if (responseRate >= 20) {
    insights.push({
      type: 'positive',
      title: 'Excellent Response Rate',
      description: 'Your applications are getting great attention from employers!',
      icon: 'award',
    });
  } else if (responseRate < 10) {
    insights.push({
      type: 'warning',
      title: 'Optimize Response Rate',
      description: 'Consider tailoring your resume for better ATS compatibility.',
      icon: 'target',
    });
  }

  // Interview conversion insight
  const interviewRate = current.length > 0 
    ? (current.filter(app => app.status === 'INTERVIEWING').length / current.length) * 100 
    : 0;

  if (interviewRate >= 15) {
    insights.push({
      type: 'positive',
      title: 'Great Interview Conversion',
      description: 'Your interview skills are paying off. Keep it up!',
      icon: 'award',
    });
  }

  return insights.slice(0, 3); // Return max 3 insights
}

function calculateGoalProgress(applications: any[]) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const monthlyApps = applications.filter(app => {
    const appDate = new Date(app.appliedAt);
    return appDate >= monthStart;
  });

  const monthlyGoal = 20; // Default goal
  const currentProgress = monthlyApps.length;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = daysInMonth - now.getDate();
  const dailyTarget = remainingDays > 0 ? Math.ceil((monthlyGoal - currentProgress) / remainingDays) : 0;

  return {
    monthlyGoal,
    currentProgress,
    remainingDays,
    dailyTarget: Math.max(dailyTarget, 0),
    progressPercentage: Math.round((currentProgress / monthlyGoal) * 100),
    isGoalAchieved: currentProgress >= monthlyGoal,
  };
}