
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  BarChart2, 
  Calendar, 
  Award, 
  Menu, 
  X, 
  Bell,
  Moon,
  Sun,
  BookOpenCheck,
  FileText,
  MessageCircle,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NotificationPanel from '@/components/ui/NotificationPanel';
import ChatbotPanel from '@/components/ui/ChatbotPanel';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [isChatbotPanelOpen, setChatbotPanelOpen] = useState(false);
  const location = useLocation();
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/study-plan', label: 'Study Plan', icon: <Calendar className="w-5 h-5" /> },
    { path: '/learning', label: 'Start Learning', icon: <BookOpenCheck className="w-5 h-5" /> },
    { path: '/tests', label: 'Tests', icon: <FileText className="w-5 h-5" /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { path: '/achievements', label: 'Achievements', icon: <Award className="w-5 h-5" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block">StudyMind</span>
            </Link>
          </div>
          
          <div className="hidden flex-1 md:flex">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 whitespace-nowrap transition-colors hover:text-primary",
                    location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex flex-1 items-center justify-end space-x-4">
            <button 
              className="relative rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Chatbot"
              onClick={() => {
                setChatbotPanelOpen(true);
                setNotificationPanelOpen(false);
              }}
            >
              <MessageCircle className="h-5 w-5" />
            </button>

            <button 
              className="relative rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Notifications"
              onClick={() => {
                setNotificationPanelOpen(true);
                setChatbotPanelOpen(false);
              }}
            >
              <Bell className="h-5 w-5" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
              )}
            </button>
            
            <Link 
              to="/profile" 
              className="relative rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="User Profile"
            >
              <User className="h-5 w-5" />
            </Link>

            <button 
              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              className="block rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="container pb-3 md:hidden animate-fade-in">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 transition-colors",
                    location.pathname === item.path 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <NotificationPanel 
        isOpen={isNotificationPanelOpen} 
        onClose={() => setNotificationPanelOpen(false)} 
      />

      <ChatbotPanel
        isOpen={isChatbotPanelOpen}
        onClose={() => setChatbotPanelOpen(false)}
      />
    </>
  );
};

export default Header;
