
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User as UserIcon, Eye, EyeOff, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Card from '@/components/common/Card';

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    subjects: [] as string[],
    studyGoal: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const subjectOptions = [
    "Mathematics", "Physics", "Chemistry", "Biology", 
    "Computer Science", "History", "Geography", "Literature",
    "Economics", "Psychology"
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleSubject = (subject: string) => {
    if (formData.subjects.includes(subject)) {
      setFormData(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s !== subject)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    }
  };
  
  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Your password should be at least 8 characters long.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (formData.subjects.length === 0) {
      toast({
        title: "No subjects selected",
        description: "Please select at least one subject.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.studyGoal) {
      toast({
        title: "No study goal",
        description: "Please enter your study goal.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };
  
  const handlePrevStep = () => {
    setStep(1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
      
      navigate('/');
    }, 1500);
  };
  
  const handleGoogleSignup = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Google Sign-Up",
        description: "You have successfully signed up with Google.",
      });
      
      navigate('/');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-muted/30">
      <Link to="/" className="mb-8 flex items-center space-x-2">
        <BookOpen className="h-10 w-10 text-primary" />
        <span className="text-2xl font-bold">StudyMind</span>
      </Link>
      
      <Card className="max-w-md w-full p-8" glass>
        <div className="space-y-2 text-center mb-6">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">
            {step === 1 
              ? "Enter your details to get started" 
              : "Tell us about your study preferences"}
          </p>
        </div>
        
        {/* Step indicators */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            /* Step 1: Account Information */
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    className="pl-10"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <Button
                type="button"
                className="w-full mt-4"
                onClick={handleNextStep}
                disabled={loading}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="relative flex items-center my-6">
                <div className="flex-1 border-t"></div>
                <div className="mx-4 text-xs text-muted-foreground">or continue with</div>
                <div className="flex-1 border-t"></div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignup}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </Button>
            </>
          ) : (
            /* Step 2: Study Preferences */
            <>
              <div className="space-y-2">
                <Label>Select Your Subjects</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {subjectOptions.map(subject => (
                    <button
                      key={subject}
                      type="button"
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                        formData.subjects.includes(subject)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                      onClick={() => toggleSubject(subject)}
                    >
                      {subject}
                      {formData.subjects.includes(subject) && (
                        <Check className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studyGoal">Your Study Goal</Label>
                <Input
                  id="studyGoal"
                  name="studyGoal"
                  placeholder="e.g., Score 90% in final exams"
                  value={formData.studyGoal}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              
              <div className="flex space-x-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2"
                  onClick={handlePrevStep}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="w-1/2"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </>
          )}
        </form>
        
        {step === 1 && (
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        )}
      </Card>
      
      <p className="mt-8 text-center text-xs text-muted-foreground">
        By signing up, you agree to our{' '}
        <a href="#" className="underline underline-offset-2 hover:text-primary">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline underline-offset-2 hover:text-primary">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default SignupPage;
