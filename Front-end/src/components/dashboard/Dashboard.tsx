
import React from 'react';
import RecommendationCard from './RecommendationCard';
import ProgressSummary from './ProgressSummary';
import GoalWidget from './GoalWidget';
import StudyPathTracker from './StudyPathTracker';
import MotivationalMessage from '../common/MotivationalMessage';

const Dashboard = () => {
  // Sample recommendations data
  const recommendations = [
    {
      id: '1',
      title: 'Calculus: Derivatives',
      description: 'Master the concept of derivatives, their applications, and key formulas.',
      duration: '45 mins',
      difficulty: 'medium' as const
    },
    {
      id: '2',
      title: 'Physics: Momentum',
      description: 'Understand conservation of momentum and solve related problems.',
      duration: '30 mins',
      difficulty: 'easy' as const
    },
    {
      id: '3',
      title: 'Advanced Statistics',
      description: 'Delve into hypothesis testing and confidence intervals.',
      duration: '60 mins',
      difficulty: 'hard' as const
    }
  ];
  
  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="md:w-2/3 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Hello, Student</h1>
          <p className="text-muted-foreground">
            Here's what AI recommends for your study session today.
          </p>
        </div>
        <div className="md:w-1/3">
          <MotivationalMessage streak={7} className="h-full" />
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {recommendations.map((rec) => (
          <RecommendationCard
            key={rec.id}
            title={rec.title}
            description={rec.description}
            duration={rec.duration}
            difficulty={rec.difficulty}
          />
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <ProgressSummary 
          totalStudyHours={28}
          completedTopics={15}
          totalTopics={42}
          weeklyChange={12}
        />
        <GoalWidget />
        <StudyPathTracker />
      </div>
    </div>
  );
};

export default Dashboard;
