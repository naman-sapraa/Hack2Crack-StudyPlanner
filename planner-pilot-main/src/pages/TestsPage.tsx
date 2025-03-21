
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, FileText, Clock, Brain, Target, BarChart3, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TestsPage = () => {
  const { toast } = useToast();
  const [testCreated, setTestCreated] = useState(false);
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  
  // Mock test data
  const availableTests = [
    {
      id: 't1',
      title: 'Physics Mid-Term Test',
      questionsCount: 30,
      duration: '45 minutes',
      difficulty: 'Medium',
      tags: ['Mechanics', 'Thermodynamics']
    },
    {
      id: 't2',
      title: 'Chemistry Comprehensive Test',
      questionsCount: 40,
      duration: '60 minutes',
      difficulty: 'Hard',
      tags: ['Organic', 'Inorganic', 'Physical']
    },
    {
      id: 't3',
      title: 'Mathematics Quick Quiz',
      questionsCount: 20,
      duration: '30 minutes',
      difficulty: 'Easy',
      tags: ['Algebra', 'Calculus']
    }
  ];
  
  const addTopic = () => {
    if (newTopic.trim() !== '' && !customTopics.includes(newTopic.trim())) {
      setCustomTopics([...customTopics, newTopic.trim()]);
      setNewTopic('');
    }
  };
  
  const removeTopic = (topic: string) => {
    setCustomTopics(customTopics.filter(t => t !== topic));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTopic();
    }
  };
  
  const generateTest = () => {
    toast({
      title: "Test Created Successfully",
      description: "Your custom test is ready. Start now or save for later.",
    });
    setTestCreated(true);
  };

  return (
    <Layout>
      <div className="container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Test Yourself</h1>
          <p className="text-muted-foreground">
            Assess your knowledge with AI-generated tests tailored to your learning goals
          </p>
        </div>
        
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="create">Create Test</TabsTrigger>
            <TabsTrigger value="available">Available Tests</TabsTrigger>
            <TabsTrigger value="history">Test History</TabsTrigger>
          </TabsList>
          
          {/* Create Test Tab */}
          <TabsContent value="create">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-2">Custom Test Generator</h2>
                <p className="text-muted-foreground">Create a personalized test based on your preferences</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Questions</label>
                    <div className="space-y-2">
                      <Slider
                        defaultValue={[25]}
                        min={5}
                        max={50}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">5</span>
                        <span className="text-sm font-medium">25 questions</span>
                        <span className="text-sm text-muted-foreground">50</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty</label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Custom Topics</label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        placeholder="Enter topic and press enter"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Button 
                        type="button"
                        size="icon"
                        onClick={addTopic}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {customTopics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {customTopics.map((topic, index) => (
                          <div 
                            key={index} 
                            className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center"
                          >
                            {topic}
                            <button
                              type="button"
                              className="ml-2 hover:text-destructive"
                              onClick={() => removeTopic(topic)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline">Reset</Button>
                <Button onClick={generateTest}>Generate Test</Button>
              </div>
            </Card>
            
            {testCreated && (
              <Card className="p-6 mt-6 animate-fade-in">
                <div className="flex items-center text-green-500 mb-4">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-medium">Test Created Successfully</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Physics Test</h4>
                      <p className="text-sm text-muted-foreground">25 questions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Difficulty</h4>
                      <p className="text-sm text-muted-foreground">Medium</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Brain className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Topics</h4>
                      <p className="text-sm text-muted-foreground">
                        {customTopics.length > 0 
                          ? customTopics.slice(0, 2).join(', ') + (customTopics.length > 2 ? '...' : '')
                          : 'All topics'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Save for Later</Button>
                  <Button>Start Test Now</Button>
                </div>
              </Card>
            )}
          </TabsContent>
          
          {/* Available Tests Tab */}
          <TabsContent value="available">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableTests.map((test) => (
                <Card key={test.id} className="p-6" hoverable>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">{test.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {test.tags.map((tag) => (
                        <span key={tag} className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
                      <FileText className="h-5 w-5 text-primary mb-1" />
                      <span className="text-sm font-medium">{test.questionsCount}</span>
                      <span className="text-xs text-muted-foreground">Questions</span>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
                      <Clock className="h-5 w-5 text-primary mb-1" />
                      <span className="text-sm font-medium">{test.duration}</span>
                      <span className="text-xs text-muted-foreground">Duration</span>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
                      <Target className="h-5 w-5 text-primary mb-1" />
                      <span className="text-sm font-medium">{test.difficulty}</span>
                      <span className="text-xs text-muted-foreground">Difficulty</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline">View Details</Button>
                    <Button>Start Test</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Test History Tab */}
          <TabsContent value="history">
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <BarChart3 className="h-12 w-12 text-muted-foreground opacity-40" />
                <h3 className="text-lg font-medium">No tests completed yet</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Complete your first test to see your performance history and analytics here.
                </p>
                <Button variant="outline">Go to Available Tests</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TestsPage;
