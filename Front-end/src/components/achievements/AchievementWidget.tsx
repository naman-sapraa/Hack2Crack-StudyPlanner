
import React, { useState } from 'react';
import Card from '../common/Card';
import { cn } from '@/lib/utils';
import { Progress } from "@/components/ui/progress";
import { Award, Star, Medal, Clock, BookOpen, Flame, Target, TrendingUp, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  date: string;
  isNew?: boolean;
  isLocked?: boolean;
  progress?: number;
  type: 'streak' | 'mastery' | 'milestone' | 'improvement';
}

interface AchievementWidgetProps {
  className?: string;
}

const AchievementWidget = ({ className }: AchievementWidgetProps) => {
  // Sample achievements data
  const achievements: Achievement[] = [
    {
      id: 'achievement-1',
      title: '7-Day Study Streak',
      description: 'You studied for 7 consecutive days!',
      icon: <Flame className="h-5 w-5" />,
      date: 'May 15, 2023',
      isNew: true,
      type: 'streak'
    },
    {
      id: 'achievement-2',
      title: 'Physics Master',
      description: 'You completed all physics modules with a score above 90%!',
      icon: <Star className="h-5 w-5" />,
      date: 'May 10, 2023',
      type: 'mastery'
    },
    {
      id: 'achievement-3',
      title: '50 Hours of Learning',
      description: 'You\'ve spent over 50 hours studying this month!',
      icon: <Clock className="h-5 w-5" />,
      date: 'May 8, 2023',
      type: 'milestone'
    },
    {
      id: 'achievement-4',
      title: 'Mathematics Improvement',
      description: 'Your mathematics scores improved by 25% over the last month!',
      icon: <TrendingUp className="h-5 w-5" />,
      date: 'May 5, 2023',
      type: 'improvement'
    },
    {
      id: 'achievement-5',
      title: 'Chemistry Expert',
      description: 'Master all chemistry topics for your entrance exam',
      icon: <BookOpen className="h-5 w-5" />,
      date: 'In progress',
      isLocked: true,
      progress: 65,
      type: 'milestone'
    },
    {
      id: 'achievement-6',
      title: 'Biology Champion',
      description: 'Score above 90% in all biology practice tests',
      icon: <Target className="h-5 w-5" />,
      date: 'In progress',
      isLocked: true,
      progress: 40,
      type: 'milestone'
    },
    {
      id: 'achievement-7',
      title: '30-Day Perfect Streak',
      description: 'Study every day for 30 consecutive days',
      icon: <Flame className="h-5 w-5" />,
      date: 'In progress',
      isLocked: true,
      progress: 23,
      type: 'streak'
    }
  ];
  
  const lockedAchievements = achievements.filter(a => a.isLocked);
  const unlockedAchievements = achievements.filter(a => !a.isLocked);
  
  const iconColors = {
    streak: 'text-amber-500',
    mastery: 'text-purple-500',
    milestone: 'text-blue-500',
    improvement: 'text-green-500'
  };
  
  const bgColors = {
    streak: 'bg-amber-100 dark:bg-amber-900/30',
    mastery: 'bg-purple-100 dark:bg-purple-900/30',
    milestone: 'bg-blue-100 dark:bg-blue-900/30',
    improvement: 'bg-green-100 dark:bg-green-900/30'
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Achievements</h2>
      </div>
      
      <Tabs defaultValue="unlocked" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unlocked" className="mt-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {unlockedAchievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={cn(
                  "relative overflow-hidden transition-all duration-300",
                  achievement.isNew && "ring-2 ring-primary ring-offset-2"
                )}
                hoverable
              >
                {achievement.isNew && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                      New
                    </span>
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={cn(
                    "rounded-full p-3 flex-shrink-0",
                    bgColors[achievement.type]
                  )}>
                    <div className={iconColors[achievement.type]}>
                      {achievement.icon}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Achieved on {achievement.date}</p>
                  </div>
                </div>
                
                {achievement.isNew && (
                  <div className="absolute -top-6 -right-6">
                    <div className="confetti-container">
                      <div className="confetti bg-yellow-300 animate-confetti-1" style={{ left: '10%' }}></div>
                      <div className="confetti bg-blue-300 animate-confetti-2" style={{ left: '30%' }}></div>
                      <div className="confetti bg-pink-300 animate-confetti-3" style={{ left: '50%' }}></div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="locked" className="mt-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {lockedAchievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className="relative overflow-hidden transition-all duration-300 bg-muted/40"
                hoverable
              >
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </span>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="rounded-full p-3 flex-shrink-0 bg-muted/60">
                    <div className="text-muted-foreground">
                      {achievement.icon}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    
                    {achievement.progress !== undefined && (
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementWidget;
