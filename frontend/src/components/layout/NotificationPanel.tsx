import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  Briefcase,
  TrendingUp,
  AlertCircle,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Notification {
  id: string;
  type: 'application' | 'reminder' | 'system' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Mock notifications - in a real app, these would come from your backend
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Follow up reminder',
    message: 'Time to follow up on your application to TechCorp for Senior Frontend Developer position.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionUrl: '/track',
  },
  {
    id: '2',
    type: 'application',
    title: 'Application status updated',
    message: 'Your application to DataFlow Inc has been moved to "Interviewing" status.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: false,
    actionUrl: '/track',
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Resume score improved!',
    message: 'Your ATS compatibility score increased to 85% after recent optimizations.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    actionUrl: '/resume-ats',
  },
  {
    id: '4',
    type: 'system',
    title: 'Weekly digest ready',
    message: 'Your weekly job search summary is ready. You applied to 3 new positions this week.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Interview preparation',
    message: 'You have an interview with InnovateLab tomorrow at 2:00 PM. Good luck!',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    actionUrl: '/track',
  },
];

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'application':
        return <Briefcase className="h-4 w-4" />;
      case 'reminder':
        return <Calendar className="h-4 w-4" />;
      case 'system':
        return <AlertCircle className="h-4 w-4" />;
      case 'achievement':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'application':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'reminder':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'system':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      case 'achievement':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No notifications</p>
                <p className="text-sm text-muted-foreground">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer',
                        !notification.read && 'bg-muted/30'
                      )}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          'p-2 rounded-full flex-shrink-0',
                          getNotificationColor(notification.type)
                        )}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                'text-sm font-medium truncate',
                                !notification.read && 'font-semibold'
                              )}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <div className="h-2 w-2 bg-primary rounded-full"></div>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}