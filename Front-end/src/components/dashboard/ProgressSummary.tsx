
import React from 'react';
import { BarChart2, ArrowUpRight, Clock } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ProgressSummaryProps {
  totalStudyHours: number;
  completedTopics: number;
  totalTopics: number;
  weeklyChange: number;
  className?: string;
}

const ProgressSummary = ({
  totalStudyHours,
  completedTopics,
  totalTopics,
  weeklyChange,
  className
}: ProgressSummaryProps) => {
  const progressPercentage = Math.round((completedTopics / totalTopics) * 100);
  
  return (
    <Card className={cn("space-y-4 transition-all", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Progress</h3>
        <Link to="/analytics">
          <BarChart2 className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Study Time</p>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-2xl font-bold">{totalStudyHours}h</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Completed</p>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">{completedTopics}/{totalTopics}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span className="font-medium">{progressPercentage}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary">
          <div 
            className="h-full rounded-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center text-sm">
        <Link to="/analytics" className="flex items-center w-full">
          <span className={cn(
            "flex items-center font-medium",
            weeklyChange >= 0 ? "text-green-500" : "text-red-500"
          )}>
            <ArrowUpRight className={cn(
              "h-4 w-4 mr-1",
              weeklyChange < 0 && "rotate-180"
            )} />
            {Math.abs(weeklyChange)}% 
          </span>
          <span className="ml-1 text-muted-foreground">from last week</span>
        </Link>
      </div>
    </Card>
  );
};

export default ProgressSummary;
