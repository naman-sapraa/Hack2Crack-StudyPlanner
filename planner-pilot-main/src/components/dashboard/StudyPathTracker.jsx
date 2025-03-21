
import React from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '@/lib/utils';

const StudyPathTracker = ({ className }) => {
  const pathItems = [
    { id: '1', title: 'Introduction to Linear Algebra', completed: true },
    { id: '2', title: 'Matrix Operations & Transformations', completed: true },
    { id: '3', title: 'Vector Spaces & Subspaces', completed: false, isCurrent: true },
    { id: '4', title: 'Eigenvalues & Eigenvectors', completed: false },
    { id: '5', title: 'Applications in Machine Learning', completed: false },
  ];

  return (
    <Card className={cn("space-y-4", className)}>
      <h3 className="text-lg font-medium">Your Study Path</h3>
      
      <div className="space-y-2">
        {pathItems.map((item, index) => (
          <div key={item.id} className="flex relative">
            {/* Line connecting steps */}
            {index < pathItems.length - 1 && (
              <div className={cn(
                "absolute left-[15px] top-6 w-0.5 h-full -z-10",
                item.completed ? "bg-primary" : "bg-muted-foreground/30"
              )} />
            )}
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {item.completed ? (
                  <CheckCircle className="h-7 w-7 text-primary" />
                ) : (
                  <Circle 
                    className={cn(
                      "h-7 w-7", 
                      item.isCurrent 
                        ? "text-primary stroke-[1.5px]" 
                        : "text-muted-foreground/50"
                    )} 
                  />
                )}
              </div>
              
              <div className="space-y-1 pt-0.5">
                <h4 className={cn(
                  "font-medium transition-colors",
                  item.completed 
                    ? "text-foreground" 
                    : item.isCurrent 
                      ? "text-foreground" 
                      : "text-muted-foreground"
                )}>
                  {item.title}
                </h4>
                
                {item.isCurrent && (
                  <div className="flex space-x-2">
                    <span className="text-xs text-muted-foreground">In progress</span>
                    <span className="relative flex h-2 w-2 mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2">
        <button className="inline-flex items-center space-x-1 text-sm font-medium text-primary transition-colors hover:text-primary-light">
          <span>View detailed path</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
};

export default StudyPathTracker;
