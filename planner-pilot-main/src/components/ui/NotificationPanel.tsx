
import React, { useState } from 'react';
import Card from '../common/Card';
import { cn } from '@/lib/utils';
import { Bell, X, Clock, Lightbulb, RefreshCw, Star, Check } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'insight' | 'achievement' | 'suggestion';
  time: string;
  isRead: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const NotificationPanel = ({ isOpen, onClose, className }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notification-1',
      title: 'Time for a Quick Revision!',
      message: 'AI suggests reviewing Quantum Physics concepts before your next session.',
      type: 'reminder',
      time: '5 minutes ago',
      isRead: false
    },
    {
      id: 'notification-2',
      title: 'Learning Speed Increased!',
      message: 'Your learning speed has increased by 20% in the last week. Keep up the good work!',
      type: 'insight',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 'notification-3',
      title: 'New Achievement Unlocked!',
      message: 'You\'ve completed 10 study sessions this week!',
      type: 'achievement',
      time: '1 day ago',
      isRead: true
    },
    {
      id: 'notification-4',
      title: 'Struggling with Calculus?',
      message: 'Here\'s a 5-minute AI-curated crash course on differential equations.',
      type: 'suggestion',
      time: '2 days ago',
      isRead: true
    }
  ]);
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const notificationIcons = {
    reminder: <Clock className="h-5 w-5 text-blue-500" />,
    insight: <Lightbulb className="h-5 w-5 text-amber-500" />,
    achievement: <Star className="h-5 w-5 text-purple-500" />,
    suggestion: <RefreshCw className="h-5 w-5 text-green-500" />
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-full sm:w-96 z-50 transform transition-transform duration-300 ease-in-out bg-background border-l shadow-xl",
      isOpen ? "translate-x-0" : "translate-x-full",
      className
    )}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-medium">Notifications</h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm text-primary hover:text-primary-light"
              >
                Mark all as read
              </button>
            )}
            <button 
              onClick={onClose}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Bell className="h-10 w-10 mb-2 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "relative rounded-lg border p-4 transition-all",
                  notification.isRead ? "opacity-70" : "border-primary/50 bg-primary/5"
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {notificationIcons[notification.type]}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h3 className={cn(
                        "font-medium pr-6",
                        !notification.isRead && "text-primary"
                      )}>
                        {notification.title}
                      </h3>
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                      
                      {!notification.isRead && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-center text-xs text-primary hover:text-primary-light"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
