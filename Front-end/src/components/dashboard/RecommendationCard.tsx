
import React from 'react';
import { ArrowRight, Clock, Bookmark } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface RecommendationCardProps {
  title: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  className?: string;
}

const RecommendationCard = ({ 
  title, 
  description, 
  duration, 
  difficulty, 
  className 
}: RecommendationCardProps) => {
  const difficultyColors = {
    easy: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    medium: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    hard: 'text-red-500 bg-red-50 dark:bg-red-900/20'
  };
  
  return (
    <Card 
      className={cn("overflow-hidden group", className)} 
      hoverable
    >
      <div className="mb-4 flex justify-between items-start">
        <h3 className="font-medium">{title}</h3>
        <span 
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium", 
            difficultyColors[difficulty]
          )}
        >
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
        <Link 
          to={`/learning?topic=${encodeURIComponent(title)}`} 
          className="inline-flex items-center space-x-1 text-sm font-medium text-primary transition-colors hover:text-primary-light"
        >
          <span>Start learning</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Card>
  );
};

export default RecommendationCard;
