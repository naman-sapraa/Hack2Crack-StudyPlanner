
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProgressTracker from '@/components/analytics/ProgressTracker';

const AnalyticsPage = () => {
  return (
    <Layout className="container py-8">
      <div className="space-y-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Progress</h1>
        <p className="text-muted-foreground">
          Track your study performance and get AI-powered insights for improvement.
        </p>
      </div>
      
      <ProgressTracker />
    </Layout>
  );
};

export default AnalyticsPage;
