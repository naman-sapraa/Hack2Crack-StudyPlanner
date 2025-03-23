
import React, { useState } from 'react';
import Card from '../common/Card';
import { cn } from '@/lib/utils';
import { BarChart, LineChart, AreaChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, TrendingUp, Flame, AlertCircle } from 'lucide-react';

interface ProgressTrackerProps {
  className?: string;
}

const ProgressTracker = ({ className }: ProgressTrackerProps) => {
  const [activeChart, setActiveChart] = useState<string | null>(null);
  
  // Sample data for charts
  const weeklyStudyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.1 },
    { day: 'Fri', hours: 2.8 },
    { day: 'Sat', hours: 4.5 },
    { day: 'Sun', hours: 3.7 },
  ];
  
  const subjectProgressData = [
    { subject: 'Math', progress: 75, color: '#3B82F6' },
    { subject: 'Physics', progress: 62, color: '#10B981' },
    { subject: 'Chemistry', progress: 48, color: '#F59E0B' },
    { subject: 'Biology', progress: 83, color: '#8B5CF6' },
    { subject: 'History', progress: 35, color: '#EC4899' },
  ];
  
  const performanceTrendData = [
    { month: 'Jan', score: 72 },
    { month: 'Feb', score: 68 },
    { month: 'Mar', score: 74 },
    { month: 'Apr', score: 77 },
    { month: 'May', score: 82 },
    { month: 'Jun', score: 79 },
  ];

  const insightItems = [
    {
      id: 'insight-1',
      title: 'Consistency Boost',
      description: 'You\'ve maintained a study streak of 12 days! This consistency is improving your retention by an estimated 18%.',
      icon: <Flame className="h-5 w-5 text-amber-500" />
    },
    {
      id: 'insight-2',
      title: 'Subject Focus Needed',
      description: 'History needs more attention. AI suggests scheduling 2 more sessions this week to improve your understanding.',
      icon: <AlertCircle className="h-5 w-5 text-red-500" />
    },
    {
      id: 'insight-3',
      title: 'Performance Trend',
      description: 'Your overall performance has improved by 10% over the last month. Keep up the good work!',
      icon: <TrendingUp className="h-5 w-5 text-green-500" />
    }
  ];

  const chartColors = {
    bar: 'rgba(59, 130, 246, 0.8)',
    barHover: 'rgba(30, 64, 175, 0.9)',
    area: 'rgba(59, 130, 246, 0.8)',
    areaHover: 'rgba(30, 64, 175, 0.9)',
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Study Hours Chart */}
        <Card 
          className="p-6 transition-all duration-300" 
          hoverable
          onMouseEnter={() => setActiveChart('studyHours')}
          onMouseLeave={() => setActiveChart(null)}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">Weekly Study Hours</h3>
              <p className="text-sm text-muted-foreground">Total: 20.6 hours</p>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStudyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis tickCount={5} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '8px 12px',
                  }}
                  itemStyle={{ color: '#3B82F6' }}
                  formatter={(value) => [`${value} hrs`, 'Study Time']}
                />
                <Bar 
                  dataKey="hours" 
                  fill={activeChart === 'studyHours' ? chartColors.barHover : chartColors.bar} 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Performance Trend */}
        <Card 
          className="p-6 transition-all duration-300" 
          hoverable
          onMouseEnter={() => setActiveChart('performance')}
          onMouseLeave={() => setActiveChart(null)}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">Performance Trend</h3>
              <p className="text-sm text-muted-foreground">Last 6 months</p>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeChart === 'performance' ? chartColors.areaHover : chartColors.area} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={activeChart === 'performance' ? chartColors.areaHover : chartColors.area} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '8px 12px',
                  }}
                  itemStyle={{ color: '#3B82F6' }}
                  formatter={(value) => [`${value}%`, 'Score']}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke={activeChart === 'performance' ? chartColors.areaHover : chartColors.area} 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Subject Progress */}
      <Card 
        className="p-6 transition-all duration-300" 
        hoverable
        onMouseEnter={() => setActiveChart('subjects')}
        onMouseLeave={() => setActiveChart(null)}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Subject Progress</h3>
            <p className="text-sm text-muted-foreground">Progress across different subjects</p>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={subjectProgressData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(0,0,0,0.1)" />
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
              <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '8px 12px',
                }}
                formatter={(value) => [`${value}%`, 'Progress']}
              />
              <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
                {subjectProgressData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={activeChart === 'subjects' ? '#1e3a8a' : entry.color} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* AI Insights */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {insightItems.map((item) => (
          <Card key={item.id} className="p-6 space-y-3 transition-all duration-300" hoverable>
            <div className="flex items-center space-x-2">
              {item.icon}
              <h3 className="font-medium">{item.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
