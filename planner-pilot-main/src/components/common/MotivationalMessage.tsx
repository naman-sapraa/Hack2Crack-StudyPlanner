
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import Card from './Card';

const motivationalMessages = [
  "Your commitment to learning is inspiring! Keep going!",
  "Every study session brings you one step closer to mastery.",
  "You're making incredible progress. Stay focused!",
  "Small daily improvements lead to outstanding results over time.",
  "Your dedication today will create opportunities tomorrow.",
  "Learning is a journey, not a destination. Enjoy the process!",
  "You're building knowledge that will last a lifetime.",
  "Success comes to those who prioritize learning. That's you!",
  "Your study consistency is creating a foundation for excellence.",
  "Today's efforts are tomorrow's achievements. Keep going!"
];

interface MotivationalMessageProps {
  streak?: number;
  className?: string;
}

const MotivationalMessage = ({ streak = 0, className }: MotivationalMessageProps) => {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // Select a message based on streak or randomly
    if (streak > 5) {
      setMessage(`${streak} day streak! ${motivationalMessages[0]}`);
    } else {
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
      setMessage(motivationalMessages[randomIndex]);
    }
  }, [streak]);

  return (
    <Card className={className}>
      <div className="flex items-start space-x-3">
        <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </Card>
  );
};

export default MotivationalMessage;
