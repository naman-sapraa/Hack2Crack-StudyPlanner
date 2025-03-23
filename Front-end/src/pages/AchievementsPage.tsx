
import React from 'react';
import Layout from '@/components/layout/Layout';
import AchievementWidget from '@/components/achievements/AchievementWidget';

const AchievementsPage = () => {
  return (
    <Layout className="container py-8">
      <div className="space-y-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Achievements</h1>
        <p className="text-muted-foreground">
          Celebrate your learning milestones and track your progress.
        </p>
      </div>
      
      <AchievementWidget />
    </Layout>
  );
};

export default AchievementsPage;
