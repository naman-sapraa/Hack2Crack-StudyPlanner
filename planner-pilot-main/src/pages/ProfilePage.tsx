
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Settings, 
  Book, 
  Clock, 
  Bell, 
  Save,
  Shield,
  FileText
} from 'lucide-react';

const ProfilePage = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock profile data
  const [profile, setProfile] = useState({
    name: 'Samantha Johnson',
    email: 'samantha.j@example.com',
    bio: 'Engineering student with a focus on mathematics and computer science. Preparing for my final year exams.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Samantha&backgroundColor=b6e3f4',
    studyPreferences: {
      preferredStudyTime: 'Morning',
      sessionsPerDay: 3,
      sessionDuration: 45,
      breakDuration: 10,
      primarySubjects: ['Mathematics', 'Physics', 'Computer Science'],
      goalScore: 95
    },
    notifications: {
      studyReminders: true,
      weeklyReports: true,
      achievementAlerts: true,
      dailyTips: false
    },
    security: {
      twoFactorAuth: false,
      emailNotifications: true
    }
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved successfully.",
    });
  };
  
  const handlePreferencesUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Study Preferences Updated",
      description: "Your study preferences have been updated. Your study plan will adjust accordingly.",
    });
  };
  
  const handleNotificationToggle = (key: keyof typeof profile.notifications) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
    
    toast({
      title: "Notification Settings Updated",
      description: `${key} notifications have been ${profile.notifications[key] ? 'disabled' : 'enabled'}.`,
    });
  };
  
  const handleSecurityToggle = (key: keyof typeof profile.security) => {
    setProfile(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: !prev.security[key]
      }
    }));
    
    toast({
      title: "Security Settings Updated",
      description: `${key} has been ${profile.security[key] ? 'disabled' : 'enabled'}.`,
    });
  };
  
  return (
    <Layout>
      <div className="container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Avatar and quick stats */}
          <Card className="md:col-span-1 p-6 flex flex-col items-center space-y-4">
            <div className="relative">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="h-32 w-32 rounded-full"
              />
              {!isEditing && (
                <Button 
                  size="sm" 
                  className="absolute bottom-0 right-0"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
            
            <div className="text-center">
              <h2 className="font-medium text-lg">{profile.name}</h2>
              <p className="text-muted-foreground text-sm">{profile.email}</p>
            </div>
            
            <Separator />
            
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Study Streak</span>
                </div>
                <span className="font-medium">12 days</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <Book className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Topics Mastered</span>
                </div>
                <span className="font-medium">24</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Tests Completed</span>
                </div>
                <span className="font-medium">18</span>
              </div>
            </div>
          </Card>
          
          {/* Tabs with profile sections */}
          <div className="md:col-span-3">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Study Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Profile Info */}
              <TabsContent value="profile">
                <Card className="p-6">
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your personal details and public profile
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={profile.name} 
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profile.email} 
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={profile.bio} 
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        placeholder="Tell us a bit about yourself"
                        className="resize-none min-h-[100px]"
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      {isEditing ? (
                        <>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </>
                      ) : (
                        <Button 
                          type="button" 
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Account Security</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage your account security settings
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                            <p className="text-xs text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch 
                            id="two-factor"
                            checked={profile.security.twoFactorAuth}
                            onCheckedChange={() => handleSecurityToggle('twoFactorAuth')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-security">Security Email Notifications</Label>
                            <p className="text-xs text-muted-foreground">
                              Receive email alerts about security events
                            </p>
                          </div>
                          <Switch 
                            id="email-security"
                            checked={profile.security.emailNotifications}
                            onCheckedChange={() => handleSecurityToggle('emailNotifications')}
                          />
                        </div>
                      </div>
                      
                      <div className="flex mt-6">
                        <Button variant="outline" className="text-destructive mr-2">
                          Reset Password
                        </Button>
                        <Button variant="outline" className="text-destructive">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Study Preferences */}
              <TabsContent value="preferences">
                <Card className="p-6">
                  <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Study Preferences</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure your study settings to optimize your learning experience
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="study-time">Preferred Study Time</Label>
                        <select 
                          id="study-time"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={profile.studyPreferences.preferredStudyTime}
                          onChange={(e) => setProfile({
                            ...profile, 
                            studyPreferences: {
                              ...profile.studyPreferences,
                              preferredStudyTime: e.target.value
                            }
                          })}
                        >
                          <option value="Morning">Morning</option>
                          <option value="Afternoon">Afternoon</option>
                          <option value="Evening">Evening</option>
                          <option value="Night">Night</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sessions">Study Sessions Per Day</Label>
                        <Input 
                          id="sessions" 
                          type="number" 
                          min={1}
                          max={10}
                          value={profile.studyPreferences.sessionsPerDay}
                          onChange={(e) => setProfile({
                            ...profile, 
                            studyPreferences: {
                              ...profile.studyPreferences,
                              sessionsPerDay: parseInt(e.target.value)
                            }
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                        <Input 
                          id="session-duration" 
                          type="number" 
                          min={15}
                          max={120}
                          step={5}
                          value={profile.studyPreferences.sessionDuration}
                          onChange={(e) => setProfile({
                            ...profile, 
                            studyPreferences: {
                              ...profile.studyPreferences,
                              sessionDuration: parseInt(e.target.value)
                            }
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="break-duration">Break Duration (minutes)</Label>
                        <Input 
                          id="break-duration" 
                          type="number" 
                          min={5}
                          max={30}
                          step={5}
                          value={profile.studyPreferences.breakDuration}
                          onChange={(e) => setProfile({
                            ...profile, 
                            studyPreferences: {
                              ...profile.studyPreferences,
                              breakDuration: parseInt(e.target.value)
                            }
                          })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goal-score">Target Score (%)</Label>
                      <Input 
                        id="goal-score" 
                        type="number" 
                        min={70}
                        max={100}
                        value={profile.studyPreferences.goalScore}
                        onChange={(e) => setProfile({
                          ...profile, 
                          studyPreferences: {
                            ...profile.studyPreferences,
                            goalScore: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Primary Subjects</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.studyPreferences.primarySubjects.map((subject, index) => (
                          <div key={index} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
                            {subject}
                            <button 
                              type="button"
                              className="ml-2 hover:text-destructive"
                              onClick={() => {
                                const newSubjects = [...profile.studyPreferences.primarySubjects];
                                newSubjects.splice(index, 1);
                                setProfile({
                                  ...profile,
                                  studyPreferences: {
                                    ...profile.studyPreferences,
                                    primarySubjects: newSubjects
                                  }
                                });
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          className="border border-dashed border-input hover:border-primary rounded-full px-3 py-1 text-sm text-muted-foreground hover:text-primary"
                          onClick={() => {
                            const subject = prompt("Enter a new subject:");
                            if (subject && !profile.studyPreferences.primarySubjects.includes(subject)) {
                              setProfile({
                                ...profile,
                                studyPreferences: {
                                  ...profile.studyPreferences,
                                  primarySubjects: [...profile.studyPreferences.primarySubjects, subject]
                                }
                              });
                            }
                          }}
                        >
                          + Add Subject
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        Save Preferences
                      </Button>
                    </div>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Notifications */}
              <TabsContent value="notifications">
                <Card className="p-6">
                  <div className="space-y-2 mb-6">
                    <h3 className="text-lg font-medium">Notification Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure which notifications you receive and how
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="study-reminders">Study Reminders</Label>
                        <p className="text-xs text-muted-foreground">
                          Get reminders for upcoming study sessions
                        </p>
                      </div>
                      <Switch 
                        id="study-reminders"
                        checked={profile.notifications.studyReminders}
                        onCheckedChange={() => handleNotificationToggle('studyReminders')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weekly-reports">Weekly Reports</Label>
                        <p className="text-xs text-muted-foreground">
                          Receive weekly summaries of your learning progress
                        </p>
                      </div>
                      <Switch 
                        id="weekly-reports"
                        checked={profile.notifications.weeklyReports}
                        onCheckedChange={() => handleNotificationToggle('weeklyReports')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                        <p className="text-xs text-muted-foreground">
                          Get notified when you earn new achievements
                        </p>
                      </div>
                      <Switch 
                        id="achievement-alerts"
                        checked={profile.notifications.achievementAlerts}
                        onCheckedChange={() => handleNotificationToggle('achievementAlerts')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="daily-tips">Daily Learning Tips</Label>
                        <p className="text-xs text-muted-foreground">
                          AI-powered tips to improve your study efficiency
                        </p>
                      </div>
                      <Switch 
                        id="daily-tips"
                        checked={profile.notifications.dailyTips}
                        onCheckedChange={() => handleNotificationToggle('dailyTips')}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
