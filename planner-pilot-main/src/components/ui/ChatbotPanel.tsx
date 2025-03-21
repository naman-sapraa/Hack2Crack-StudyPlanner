import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// Define the base API URL
const API_URL = 'http://localhost:5000';

const ChatbotPanel = ({ isOpen, onClose, className }: ChatbotPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI study assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Quick reply suggestions
  const quickReplies = [
    "Create a study plan for me",
    "What topics should I focus on?",
    "Give me test preparation tips",
    "Help me with time management"
  ];

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Determine which API endpoint to call based on message content
      const lowercaseInput = inputValue.toLowerCase();
      let response;
      
      if (lowercaseInput.includes('study plan')) {
        // This would normally gather more data from the user
        // For demo purposes, we'll use some sample data
        const studyPlanData = {
          name: "Sample User",
          age: "18",
          education_status: "High School",
          target_exams: ["JEE"],
          exam_dates: ["2025-05-15"],
          grade_percentage: "85%",
          strongest_subjects: ["Mathematics"],
          weakest_subjects: ["Chemistry"],
          previous_scores: "Mock test: 75/100",
          weekday_study_hours: "4",
          weekend_study_hours: "6",
          best_study_time: "Morning",
          break_frequency: "Every 45 mins",
          learning_style: "Visual",
          textbooks: ["Standard JEE Books"],
          online_courses: ["Khan Academy"],
          coaching_classes: "Weekend coaching",
          mock_tests: "Weekly",
          sleep_schedule: "10pm - 6am",
          physical_activity: "30 min daily",
          health_conditions: "None",
          other_commitments: "School 8am-3pm",
          target_college: "IIT Delhi",
          target_score: "95+",
          preparation_months: "6",
          priority_areas: ["Physics", "Chemistry"]
        };
        
        const apiResponse = await fetch(`${API_URL}/generate-study-plan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(studyPlanData)
        });
        
        const data = await apiResponse.json();
        response = data.study_plan;
      } 
      else if (lowercaseInput.includes('quiz') || lowercaseInput.includes('test')) {
        const quizData = {
          exam_type: "JEE",
          subject: "Physics",
          num_questions: 3,
          difficulty: "Medium"
        };
        
        const apiResponse = await fetch(`${API_URL}/generate-quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(quizData)
        });
        
        const data = await apiResponse.json();
        // Format the quiz nicely
        const quizQuestions = data.quiz;
        let formattedQuiz = "Here's a quick quiz to test your knowledge:\n\n";
        
        quizQuestions.forEach((q, index) => {
          formattedQuiz += `Q${index + 1}: ${q.question}\n`;
          Object.entries(q.options).forEach(([key, value]) => {
            formattedQuiz += `${key}: ${value}\n`;
          });
          formattedQuiz += `\n`;
        });
        
        formattedQuiz += "Let me know when you're ready for the answers!";
        response = formattedQuiz;
      }
      else if (lowercaseInput.includes('resources') || lowercaseInput.includes('material')) {
        const searchData = {
          user_query: inputValue
        };
        
        const apiResponse = await fetch(`${API_URL}/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(searchData)
        });
        
        const data = await apiResponse.json();
        response = "Here are some resources that might help:\n\n" +
                  "YouTube Videos:\n" + data.youtube_results.join('\n') +
                  "\n\nOther Resources:\n" + data.educational_resources;
      }
      else {
        // For general questions, use the generate-response endpoint
        const apiResponse = await fetch(`${API_URL}/generate-response`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ input: inputValue })
        });
        
        const data = await apiResponse.json();
        response = data.response;
      }
      
      // Add bot message with the response
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response || "Sorry, I couldn't process your request at the moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching from API:', error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to connect to the AI assistant. Please try again.",
        variant: "destructive"
      });
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting to my brain. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    // Wait for state update then send
    setTimeout(() => handleSendMessage(), 50);
  };

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-full sm:w-96 z-50 transform transition-transform duration-300 ease-in-out bg-background border-l shadow-xl",
      isOpen ? "translate-x-0" : "translate-x-full",
      className
    )}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex items-center justify-between bg-primary/5">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="font-medium">AI Study Assistant</h2>
          </div>
          
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={cn(
                "flex",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.sender === 'user' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick replies */}
        {messages.length < 3 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-full text-muted-foreground transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPanel;