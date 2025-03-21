
import React, { useState } from 'react';
import { Target, Check, Plus, Edit, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '@/lib/utils';

interface GoalProps {
  id: string;
  title: string;
  completed: boolean;
  type: 'short-term' | 'long-term';
  details?: string;
}

interface GoalWidgetProps {
  className?: string;
}

const GoalWidget = ({ className }: GoalWidgetProps) => {
  const [goals, setGoals] = useState<GoalProps[]>([
    { id: '1', title: 'Complete 3 study sessions this week', completed: false, type: 'short-term', details: 'Focus on Physics and Mathematics' },
    { id: '2', title: 'Master the calculus fundamentals', completed: false, type: 'long-term', details: 'Watch video tutorials and solve practice problems' },
    { id: '3', title: 'Review physics notes before Friday', completed: true, type: 'short-term' },
    { id: '4', title: 'Achieve 95% in next Chemistry test', completed: false, type: 'long-term', details: 'Focus on organic chemistry and periodic table' }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState('');
  
  const toggleGoalCompletion = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };
  
  const toggleGoalExpansion = (id: string) => {
    setExpandedGoal(expandedGoal === id ? null : id);
  };
  
  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      setGoals([
        ...goals, 
        { 
          id: Date.now().toString(), 
          title: newGoal, 
          completed: false,
          type: 'short-term'
        }
      ]);
      setNewGoal('');
      setIsEditing(false);
    }
  };

  const filteredGoals = isExpanded ? goals : goals.slice(0, 3);
  
  return (
    <Card className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Your Study Goals</h3>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {isEditing ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="flex space-x-4 text-sm">
          <button 
            className={cn(
              "px-3 py-1 rounded-full transition-colors",
              "bg-primary/10 text-primary font-medium"
            )}
          >
            All Goals
          </button>
          <button 
            className={cn(
              "px-3 py-1 rounded-full transition-colors",
              "hover:bg-muted text-muted-foreground"
            )}
          >
            Short Term
          </button>
          <button 
            className={cn(
              "px-3 py-1 rounded-full transition-colors",
              "hover:bg-muted text-muted-foreground"
            )}
          >
            Long Term
          </button>
        </div>
      )}
      
      {isEditing && (
        <form onSubmit={addGoal} className="flex space-x-2">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add a new goal..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button 
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Add
          </button>
        </form>
      )}
      
      <ul className="space-y-3">
        {filteredGoals.map((goal) => (
          <li 
            key={goal.id}
            className="flex items-start space-x-3 group animate-fade-in"
          >
            <button
              onClick={() => toggleGoalCompletion(goal.id)}
              className={cn(
                "mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border-2 transition-colors",
                goal.completed 
                  ? "bg-primary border-primary text-primary-foreground flex items-center justify-center" 
                  : "border-muted-foreground"
              )}
            >
              {goal.completed && <Check className="h-3 w-3" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-sm transition-colors",
                  goal.completed && "line-through text-muted-foreground"
                )}>
                  {goal.title}
                </span>
                {goal.details && (
                  <button
                    onClick={() => toggleGoalExpansion(goal.id)}
                    className="text-muted-foreground hover:text-foreground p-1 rounded-full"
                  >
                    {expandedGoal === goal.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                )}
              </div>
              {expandedGoal === goal.id && goal.details && (
                <div className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-md animate-fade-in">
                  {goal.details}
                </div>
              )}
              <div className="mt-1">
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  goal.type === 'short-term' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                )}>
                  {goal.type === 'short-term' ? 'Short Term' : 'Long Term'}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="pt-2">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center space-x-1 text-sm font-medium text-primary transition-colors hover:text-primary-light"
        >
          <span>{isExpanded ? 'Show less' : 'View all goals'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
};

export default GoalWidget;
