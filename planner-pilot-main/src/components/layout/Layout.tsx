
import React from 'react';
import Header from './Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={cn("flex-1 overflow-auto", className)}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
