
import React, { useState } from 'react';
import CalendarView from './CalendarView';
import Card from '../common/Card';
import { Clock, AlarmClock, Brain, Calendar as CalendarIcon, List } from 'lucide-react';
import { cn } from '@/lib/utils';

const StudyPlan = () => {
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');
  
  // Sample study plan data
  const studyStats = [
    { 
      id: 'weekly-hours', 
      label: 'Weekly Study Hours', 
      value: '18', 
      icon: <Clock className="h-5 w-5 text-primary" />,
      change: '+2h from last week'
    },
    { 
      id: 'optimal-time', 
      label: 'Optimal Study Time', 
      value: 'Morning', 
      icon: <AlarmClock className="h-5 w-5 text-primary" />,
      change: 'Based on your past performance'
    },
    { 
      id: 'focus-subject', 
      label: 'Focus Subject', 
      value: 'Mathematics', 
      icon: <Brain className="h-5 w-5 text-primary" />,
      change: 'Suggested by AI'
    }
  ];
  
  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Study Plan</h1>
        <p className="text-muted-foreground">
          AI-optimized study schedule based on your learning patterns and goals.
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {studyStats.map((stat) => (
          <Card key={stat.id} className="flex flex-col space-y-2" hoverable>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </Card>
        ))}
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Study Schedule</h2>
          <div className="flex items-center space-x-1 bg-muted/50 rounded-md p-1">
            <button
              onClick={() => setActiveView('calendar')}
              className={cn(
                "flex items-center space-x-1 px-3 py-1 rounded-md text-sm",
                activeView === 'calendar' 
                  ? "bg-background shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={cn(
                "flex items-center space-x-1 px-3 py-1 rounded-md text-sm",
                activeView === 'list' 
                  ? "bg-background shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </button>
          </div>
        </div>
        
        {activeView === 'calendar' ? (
          <CalendarView />
        ) : (
          <Card className="p-6">
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              List view coming soon
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudyPlan;
