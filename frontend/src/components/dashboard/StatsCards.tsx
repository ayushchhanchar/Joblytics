import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalApplications: number;
    interviews: number;
    offers: number;
    rejected: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviews,
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Offers Received',
      value: stats.offers,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      change: '+25%',
      changeType: 'positive' as const,
    },
    {
      title: 'Rejected / On Hold',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      change: '-5%',
      changeType: 'negative' as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{card.value}</div>
              <Badge 
                variant={card.changeType === 'positive' ? 'default' : 'destructive'}
                className="text-xs"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {card.change}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              vs last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}