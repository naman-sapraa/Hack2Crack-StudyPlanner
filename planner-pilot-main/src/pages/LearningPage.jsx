
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoResource, BookResource, OnlineResource } from '@/components/learning/Resources';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, BookOpen, Youtube, Globe } from 'lucide-react';

const LearningPage = () => {
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic') || '';
  const [searchTerm, setSearchTerm] = useState(initialTopic);
  const [topic, setTopic] = useState(initialTopic);

  const handleSearch = (e) => {
    e.preventDefault();
    setTopic(searchTerm);
  };

  useEffect(() => {
    if (initialTopic) {
      setSearchTerm(initialTopic);
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  return (
    <Layout>
      <div className="container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Start Learning</h1>
          <p className="text-muted-foreground">
            Discover curated resources to enhance your knowledge and skills
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              placeholder="Search for a topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </Card>

        {topic && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Resources for: {topic}</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="videos" className="flex items-center">
                  <Youtube className="h-4 w-4 mr-2" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="books">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Books
                </TabsTrigger>
                <TabsTrigger value="online">
                  <Globe className="h-4 w-4 mr-2" />
                  Online
                </TabsTrigger>
              </TabsList>
              <TabsContent value="videos">
                <VideoResource topic={topic} />
              </TabsContent>
              <TabsContent value="books">
                <BookResource topic={topic} />
              </TabsContent>
              <TabsContent value="online">
                <OnlineResource topic={topic} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LearningPage;
