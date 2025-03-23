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
import { CheckCircle, FileText, Clock, Brain, Target, BarChart3, X, Plus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// API URL - Update this with your Flask backend URL
const API_URL = 'http://localhost:5000';

const TestsPage = () => {
  const { toast } = useToast();
  const [testCreated, setTestCreated] = useState(false);
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form state for test generation
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [testName, setTestName] = useState('');
  const [questionCount, setQuestionCount] = useState(25);
  const [difficulty, setDifficulty] = useState('medium');
  
  // Quiz state
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [selectedHistoryTest, setSelectedHistoryTest] = useState<any>(null);
  
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
  
  const generateTest = async () => {
    setLoading(true);
    
    try {
      if (selectedSubjects.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one subject",
          variant: "destructive",
        });
        return;
      }

      // Determine exam type based on selected subjects
      const hasOnlyBiology = selectedSubjects.length === 1 && selectedSubjects.includes('biology');
      const examType = hasOnlyBiology ? 'NEET' : 'JEE';

      const requestBody = {
        exam_type: examType,
        subjects: selectedSubjects.map(subject => ({
          name: subject.charAt(0).toUpperCase() + subject.slice(1),
          question_count: Math.floor(questionCount / selectedSubjects.length)
        })),
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        topics: customTopics,
        test_name: testName || `Multi-Subject Test ${testHistory.length + 1}`
      };

      const response = await fetch(`${API_URL}/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      
      if (!data.quiz || !Array.isArray(data.quiz)) {
        throw new Error('Invalid quiz data received from server');
      }

      setCurrentQuiz(data.quiz);
      setTestCreated(true);
      setCurrentQuestion(0);
      setAnswers({});
      setQuizCompleted(false);
      setResults(null);

    } catch (error) {
      console.error('Error generating test:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnswer = (questionIndex: number, option: string) => {
    const newAnswers = { ...answers };
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
  };
  
  const goToNextQuestion = () => {
    if (currentQuestion < currentQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const submitQuiz = () => {
    if (!currentQuiz) return;
    
    // Calculate results
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;
    
    const questions = currentQuiz.map((question: any, index: number) => {
      const userAnswer = answers[index] || '';
      const isCorrect = userAnswer === question.correct_answer;
      const isSkipped = userAnswer === '';
      
      if (isCorrect) correctCount++;
      else if (isSkipped) skippedCount++;
      else incorrectCount++;
      
      return {
        ...question,
        userAnswer,
        isCorrect,
        isSkipped,
      };
    });
    
    // Group questions by topic
    const topicPerformance: {[key: string]: {correct: number, total: number}} = {};
    
    questions.forEach((question: any) => {
      const topic = question.topic || 'General';
      
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 };
      }
      
      topicPerformance[topic].total++;
      if (question.isCorrect) {
        topicPerformance[topic].correct++;
      }
    });
    
    // Generate recommendations based on performance
    const weakTopics = Object.entries(topicPerformance)
      .filter(([_, stats]) => (stats.correct / stats.total) < 0.6)
      .map(([topic]) => topic);
    
    const recommendations = weakTopics.length > 0
      ? `Focus on improving in these areas: ${weakTopics.join(', ')}.`
      : 'Great job! Continue practicing to maintain your understanding.';
    
    // Set results
    setResults({
      totalQuestions: questions.length,
      correctCount,
      incorrectCount,
      skippedCount,
      score: Math.round((correctCount / questions.length) * 100),
      questions,
      topicPerformance,
      recommendations,
    });
    
    setQuizCompleted(true);
  };
  
  const resetTest = () => {
    setTestCreated(false);
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setResults(null);
    setSelectedSubjects([]);
    setTestName('');
    setQuestionCount(25);
    setDifficulty('medium');
    setCustomTopics([]);
  };

  const saveTestResults = () => {
    if (!results) return;
    
    const historyItem = {
      id: `h${Date.now()}`,
      title: `${selectedSubjects.map(subject => subject.charAt(0).toUpperCase() + subject.slice(1)).join(', ')} Test`,
      date: new Date().toISOString(),
      questionsCount: results.totalQuestions,
      score: results.score,
      difficulty: difficulty,
      duration: '30 minutes', // You can add actual duration tracking if needed
      topics: Object.keys(results.topicPerformance),
      results: results,
      quiz: currentQuiz
    };
    
    setTestHistory(prev => [historyItem, ...prev]);
    resetTest();
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
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="create">Create Test</TabsTrigger>
            <TabsTrigger value="history">Test History</TabsTrigger>
          </TabsList>
          
          {/* Create Test Tab */}
          <TabsContent value="create">
            {!testCreated ? (
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium mb-2">Custom Test Generator</h2>
                  <p className="text-muted-foreground">Create a personalized test based on your preferences</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subjects</label>
                      <div className="flex flex-wrap gap-2">
                        {['physics', 'chemistry', 'mathematics', 'biology'].map((subject) => (
                          <button
                            key={subject}
                            onClick={() => {
                              if (selectedSubjects.includes(subject)) {
                                setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
                              } else {
                                setSelectedSubjects([...selectedSubjects, subject]);
                              }
                            }}
                            className={`px-3 py-1 rounded-full border ${
                              selectedSubjects.includes(subject)
                                ? 'bg-primary text-white border-primary'
                                : 'border-muted-foreground text-muted-foreground hover:border-primary'
                            }`}
                          >
                            {subject.charAt(0).toUpperCase() + subject.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Number of Questions</label>
                      <div className="space-y-2">
                        <Slider
                          value={[questionCount]}
                          min={5}
                          max={50}
                          step={5}
                          className="w-full"
                          onValueChange={(values) => setQuestionCount(values[0])}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">5</span>
                          <span className="text-sm font-medium">{questionCount} questions</span>
                          <span className="text-sm text-muted-foreground">50</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
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
                  <Button variant="outline" onClick={resetTest}>Reset</Button>
                  <Button 
                    onClick={generateTest} 
                    disabled={loading || selectedSubjects.length === 0}
                  >
                    {loading ? 'Generating...' : 'Generate Test'}
                  </Button>
                </div>
              </Card>
            ) : !quizCompleted ? (
              // Quiz taking interface
              <Card className="p-6">
                {currentQuiz && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-medium">
                        Question {currentQuestion + 1} of {currentQuiz.length}
                      </h2>
                      <div className="text-sm text-muted-foreground">
                        Topic: {currentQuiz[currentQuestion].topic || 'General'}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="font-medium">{currentQuiz[currentQuestion].question}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(currentQuiz[currentQuestion].options).map(([option, text]) => (
                        <div 
                          key={option}
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-primary/5 transition-colors ${
                            answers[currentQuestion] === option ? 'border-primary bg-primary/10' : 'border-muted'
                          }`}
                          onClick={() => handleAnswer(currentQuestion, option)}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                              answers[currentQuestion] === option ? 'bg-primary text-white' : 'bg-muted/50'
                            }`}>
                              {option}
                            </div>
                            <div>{text as string}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <Button 
                          variant="outline" 
                          onClick={goToPreviousQuestion}
                          disabled={currentQuestion === 0}
                        >
                          Previous
                        </Button>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {Object.keys(answers).length} of {currentQuiz.length} answered
                      </div>
                      
                      <div>
                        {currentQuestion < currentQuiz.length - 1 ? (
                          <Button 
                            onClick={goToNextQuestion}
                          >
                            Next
                          </Button>
                        ) : (
                          <Button 
                            onClick={submitQuiz}
                            disabled={Object.keys(answers).length === 0}
                          >
                            Submit Test
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              // Results interface
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center text-green-500 mb-4">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <h3 className="text-lg font-medium">Test Completed!</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-muted/30 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold text-primary">{results.score}%</h4>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold text-green-500">{results.correctCount}</h4>
                      <p className="text-sm text-muted-foreground">Correct</p>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold text-red-500">{results.incorrectCount}</h4>
                      <p className="text-sm text-muted-foreground">Incorrect</p>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold text-yellow-500">{results.skippedCount}</h4>
                      <p className="text-sm text-muted-foreground">Skipped</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Topic Performance</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(results.topicPerformance).map(([topic, stats]: [string, any]) => (
                        <div key={topic} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{topic}</h4>
                            <p className="text-sm text-muted-foreground">
                              {stats.correct} of {stats.total} correct
                            </p>
                          </div>
                          <div className={`text-lg font-bold ${
                            (stats.correct / stats.total) >= 0.7 ? 'text-green-500' : 
                            (stats.correct / stats.total) >= 0.4 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {Math.round((stats.correct / stats.total) * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Recommendations</h4>
                        <p className="text-sm">{results.recommendations}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Question Review</h3>
                    
                    <div className="space-y-4">
                      {results.questions.map((question: any, index: number) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className={`p-3 ${
                            question.isCorrect ? 'bg-green-500/10' : 
                            question.isSkipped ? 'bg-yellow-500/10' : 'bg-red-500/10'
                          }`}>
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Question {index + 1}</h4>
                              <div className={`text-sm font-medium ${
                                question.isCorrect ? 'text-green-500' : 
                                question.isSkipped ? 'text-yellow-500' : 'text-red-500'
                              }`}>
                                {question.isCorrect ? 'Correct' : question.isSkipped ? 'Skipped' : 'Incorrect'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3">
                            <p className="mb-3">{question.question}</p>
                            
                            <div className="space-y-2 mb-3">
                              {Object.entries(question.options).map(([option, text]) => (
                                <div 
                                  key={option}
                                  className={`p-2 rounded-md ${
                                    option === question.correct_answer ? 'bg-green-500/10' :
                                    (option === question.userAnswer && option !== question.correct_answer) ? 'bg-red-500/10' : ''
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                                      option === question.correct_answer ? 'bg-green-500 text-white' :
                                      (option === question.userAnswer && option !== question.correct_answer) ? 'bg-red-500 text-white' : 'bg-muted/50'
                                    }`}>
                                      {option}
                                    </div>
                                    <div>{text as string}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="text-sm border-t pt-2">
                              <p><span className="font-medium">Explanation:</span> {question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={resetTest}>Create New Test</Button>
                    <Button onClick={() => {
                      saveTestResults();
                    }}>Save Results</Button>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
          
          {/* Test History Tab */}
          <TabsContent value="history">
            {selectedHistoryTest ? (
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{selectedHistoryTest.title}</h3>
                    <Button variant="outline" onClick={() => setSelectedHistoryTest(null)}>
                      Back to History
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold text-primary">{selectedHistoryTest.results.score}%</h4>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold text-green-500">{selectedHistoryTest.results.correctCount}</h4>
                      <p className="text-sm text-muted-foreground">Correct</p>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold text-red-500">{selectedHistoryTest.results.incorrectCount}</h4>
                      <p className="text-sm text-muted-foreground">Incorrect</p>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold text-yellow-500">{selectedHistoryTest.results.skippedCount}</h4>
                      <p className="text-sm text-muted-foreground">Skipped</p>
                    </div>
                  </div>

                  {/* Reuse the same results display components from the test completion view */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Topic Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedHistoryTest.results.topicPerformance).map(([topic, stats]: [string, any]) => (
                        <div key={topic} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{topic}</h4>
                            <p className="text-sm text-muted-foreground">
                              {stats.correct} of {stats.total} correct
                            </p>
                          </div>
                          <div className={`text-lg font-bold ${
                            (stats.correct / stats.total) >= 0.7 ? 'text-green-500' : 
                            (stats.correct / stats.total) >= 0.4 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {Math.round((stats.correct / stats.total) * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Question Review</h3>
                    <div className="space-y-4">
                      {selectedHistoryTest.results.questions.map((question: any, index: number) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className={`p-3 ${
                            question.isCorrect ? 'bg-green-500/10' : 
                            question.isSkipped ? 'bg-yellow-500/10' : 'bg-red-500/10'
                          }`}>
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Question {index + 1}</h4>
                              <div className={`text-sm font-medium ${
                                question.isCorrect ? 'text-green-500' : 
                                question.isSkipped ? 'text-yellow-500' : 'text-red-500'
                              }`}>
                                {question.isCorrect ? 'Correct' : question.isSkipped ? 'Skipped' : 'Incorrect'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3">
                            <p className="mb-3">{question.question}</p>
                            
                            <div className="space-y-2 mb-3">
                              {Object.entries(question.options).map(([option, text]) => (
                                <div 
                                  key={option}
                                  className={`p-2 rounded-md ${
                                    option === question.correct_answer ? 'bg-green-500/10' :
                                    (option === question.userAnswer && option !== question.correct_answer) ? 'bg-red-500/10' : ''
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                                      option === question.correct_answer ? 'bg-green-500 text-white' :
                                      (option === question.userAnswer && option !== question.correct_answer) ? 'bg-red-500 text-white' : 'bg-muted/50'
                                    }`}>
                                      {option}
                                    </div>
                                    <div>{text as string}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="text-sm border-t pt-2">
                              <p><span className="font-medium">Explanation:</span> {question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testHistory.length > 0 ? (
                  testHistory.map((test) => (
                    <Card key={test.id} className="p-6 cursor-pointer" onClick={() => setSelectedHistoryTest(test)}>
                      <div className="mb-4">
                        <h3 className="text-lg font-medium">{test.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(test.date).toLocaleDateString()}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {test.topics.map((topic: string) => (
                            <span key={topic} className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-sm">
                              {topic}
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
                          <Target className="h-5 w-5 text-primary mb-1" />
                          <span className="text-sm font-medium">{test.difficulty}</span>
                          <span className="text-xs text-muted-foreground">Difficulty</span>
                        </div>

                        <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
                          <BarChart3 className="h-5 w-5 text-primary mb-1" />
                          <span className="text-sm font-medium">{test.score}%</span>
                          <span className="text-xs text-muted-foreground">Score</span>
                        </div>
                      </div>

                      <Button className="w-full">View Details</Button>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2">
                    <Card className="p-6">
                      <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <BarChart3 className="h-12 w-12 text-muted-foreground opacity-40" />
                        <h3 className="text-lg font-medium">No tests completed yet</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                          Complete your first test to see your performance history and analytics here.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            const createTab = document.querySelector('[value="create"]') as HTMLButtonElement;
                            if (createTab) createTab.click();
                          }}
                        >
                          Create Test
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TestsPage;