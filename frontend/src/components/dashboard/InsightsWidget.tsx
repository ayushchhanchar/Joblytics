import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TrendingUp, BarChart3, Eye, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function InsightsWidget() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuickStats();
  }, []);

  const fetchQuickStats = async () => {
    try {
      const response = await axios.get('https://joblytics.notdeveloper.in/api/insights/stats', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching quick stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateResponseRate = () => {
    if (!stats || stats.total === 0) return 0;
    return Math.round(((stats.interviewing + stats.offers) / stats.total) * 100);
  };

  const calculateInterviewRate = () => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.interviewing / stats.total) * 100);
  };

  const getWeeklyGrowth = () => {
    // Mock calculation - in real app, this would compare with previous week
    return 12;
  };

  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-600/5"></div>
      <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      
      <CardHeader className="relative">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            📈 Insights & Analytics
          </span>
          <Eye className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Response Rate</span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              {calculateResponseRate()}%
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Interview Rate</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
              {calculateInterviewRate()}%
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Weekly Growth</span>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
              +{getWeeklyGrowth()}%
            </Badge>
          </div>
        </div>

        <div className="pt-2">
          <Button 
            onClick={() => navigate('/insights')} 
            className="w-full"
            variant="outline"
          >
            View Detailed Analytics
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}