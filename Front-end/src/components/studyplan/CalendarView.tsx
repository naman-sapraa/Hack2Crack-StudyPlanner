import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isComplete?: boolean;
  examType?: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

interface CalendarViewProps {
  className?: string;
  studyPlan?: any; // This would be properly typed in a real application
}

const CalendarView = ({ className, studyPlan }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  
  // Sample calendar data
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Update the generateCalendarDays function
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const today = new Date();
    
    // Get stored study plan
    const storedPlan = localStorage.getItem('studyPlan');
    const studyPlan = storedPlan ? JSON.parse(storedPlan) : null;
    
    // First day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startingDay = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Days from previous month
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        events: []
      });
    }
    
    // Days from current month
    for (let i = 1; i <= lastDay; i++) {
      const currentDate = new Date(currentYear, currentMonth, i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const isToday = i === today.getDate() && 
                      currentMonth === today.getMonth() && 
                      currentYear === today.getFullYear();
      
      // Get events for this day from study plan
      const daySchedule = studyPlan?.schedule?.find(
        (day: any) => day.date === dateString
      );
      
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday,
        events: daySchedule?.events || []
      });
    }
    
    // Days from next month
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
        events: []
      });
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };
  
  const difficultyStyles = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="p-0 overflow-hidden">
        <div className="p-4 bg-primary/5 border-b flex items-center justify-between">
          <h3 className="font-medium">Study Calendar</h3>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-1 rounded-full hover:bg-background/80"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="font-medium">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-1 rounded-full hover:bg-background/80"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {weekdays.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((day, index) => (
            <div 
              key={index}
              onClick={() => setSelectedDay(day.events.length > 0 ? day : null)}
              className={cn(
                "min-h-[80px] p-1 border-b border-r relative cursor-pointer transition-colors",
                !day.isCurrentMonth && "opacity-40 bg-muted/20",
                day.isToday && "bg-primary/5",
                day.events.length > 0 && "hover:bg-muted/40",
                (index + 1) % 7 === 0 && "border-r-0", // Remove right border on last column
                index >= calendarDays.length - 7 && "border-b-0" // Remove bottom border on last row
              )}
            >
              <div className={cn(
                "h-6 w-6 flex items-center justify-center rounded-full text-sm mb-1",
                day.isToday && "bg-primary text-primary-foreground font-medium"
              )}>
                {day.date}
              </div>
              
              <div className="space-y-1">
                {day.events.slice(0, 2).map((event) => (
                  <div 
                    key={event.id} 
                    className={cn(
                      "rounded-sm px-1 py-0.5 text-xs truncate",
                      difficultyStyles[event.difficulty],
                      event.isComplete && "opacity-60"
                    )}
                  >
                    {event.title}
                  </div>
                ))}
                
                {day.events.length > 2 && (
                  <div className="text-xs text-muted-foreground px-1">
                    +{day.events.length - 2} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {selectedDay && selectedDay.events.length > 0 && (
        <Card className="space-y-4 animate-fade-in">
          <h3 className="font-medium">
            Study Sessions for {monthNames[currentMonth]} {selectedDay.date}
          </h3>
          
          <div className="space-y-3">
            {selectedDay.events.map((event) => (
              <div 
                key={event.id}
                className={cn(
                  "rounded-lg border p-3 transition-colors",
                  event.isComplete ? "opacity-60" : "hover:border-primary/50",
                )}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium flex items-center">
                    {event.title}
                    {event.isComplete && (
                      <span className="ml-2 text-xs bg-primary/20 text-primary-foreground px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {event.examType && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        {event.examType}
                      </span>
                    )}
                    <span 
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        difficultyStyles[event.difficulty]
                      )}
                    >
                      {event.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <span>•</span>
                    <span>{event.duration}</span>
                  </div>
                  
                  {!event.isComplete && (
                    <button className="text-primary hover:text-primary-light font-medium text-sm">
                      Start session
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CalendarView;
