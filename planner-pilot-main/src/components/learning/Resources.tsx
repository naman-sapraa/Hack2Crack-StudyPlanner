import React, { useState, useEffect } from 'react';
import Card from '@/components/common/Card';
import { ExternalLink, Youtube, Book, Globe, ThumbsUp, ThumbsDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

// Define types for API responses
interface YouTubeResult {
  title: string;
  creator: string;
  link: string;
}

interface SearchResponse {
  youtube_results: string[];
  educational_resources: string;
}

interface ResourceProps {
  topic: string;
}

// API URL - make sure to update this with your actual Flask API URL
const API_URL = 'http://localhost:5000';

export const VideoResource: React.FC<ResourceProps> = ({ topic }) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_query: `${topic} tutorial videos` }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const data: SearchResponse = await response.json();
        
        // Process the YouTube results to extract information
        const formattedVideos = data.youtube_results.map((videoStr, index) => {
          const titleMatch = videoStr.match(/\*\*(.*?)\*\*/);
          const creatorMatch = videoStr.match(/\*\* - (.*?) -/);
          const linkMatch = videoStr.match(/\(([^)]+)\)/);
        
          const videoLink = linkMatch ? linkMatch[1] : '#';
          const videoIdMatch = videoLink.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
          const videoId = videoIdMatch ? videoIdMatch[1] : null;
          
          return {
            id: `video-${index}`,
            title: titleMatch ? titleMatch[1] : `Video ${index + 1}`,
            channel: creatorMatch ? creatorMatch[1] : 'Unknown Creator',
            views: 'Retrieved from YouTube',
            thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 
                        `https://placehold.co/320x180/3b82f6/ffffff?text=No+Thumbnail`,
            duration: 'N/A',
            link: videoLink,
          };
        });
        
        setVideos(formattedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast({
          title: "Error",
          description: "Failed to load video resources. Using sample data instead.",
          variant: "destructive"
        });
        // Fallback to mock data
        setVideos(getMockVideoData(topic));
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [topic, toast]);
  
  const handleFeedback = (type: 'like' | 'dislike') => {
    toast({
      title: "Feedback received",
      description: type === 'like' ? "We'll show you more content like this." : "We'll improve our recommendations.",
    });
  };
  
  return (
    <div className="mt-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          // Skeleton loading state
          Array(4).fill(0).map((_, index) => (
            <Card key={`skeleton-${index}`} className="flex flex-col p-0 overflow-hidden">
              <Skeleton className="w-full h-40" />
              <div className="p-4 space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-2/3 h-4" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </Card>
          ))
        ) : (
          videos.map((video) => (
            <Card key={video.id} className="flex flex-col p-0 overflow-hidden" hoverable>
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-40 object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                  {video.duration}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                <p className="text-muted-foreground text-xs mt-1">{video.channel}</p>
                <p className="text-muted-foreground text-xs">{video.views}</p>
                
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleFeedback('like')}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleFeedback('dislike')}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <a 
                    href={video.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-xs font-medium text-primary hover:underline"
                  >
                    Watch
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export const BookResource: React.FC<ResourceProps> = ({ topic }) => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_query: `${topic} books and textbooks` }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        
        const data: SearchResponse = await response.json();
        
        // Parse the educational_resources for book information
        // Assuming the response includes book recommendations in markdown format
        const booksText = data.educational_resources;
        
        // Simple parsing of book information from text
        // This is a basic implementation - you may want to improve it based on actual API response format
        const bookMatches = booksText.match(/\*\*(.*?)\*\*/g);
        const formattedBooks = bookMatches ? 
          bookMatches.map((match, index) => {
            const title = match.replace(/\*\*/g, '');
            return {
              id: `book-${index}`,
              title: title,
              author: 'From API',
              rating: 4.5,
              year: new Date().getFullYear(),
            };
          }) : [];
        
        setBooks(formattedBooks.length > 0 ? formattedBooks : getMockBookData(topic));
      } catch (error) {
        console.error('Error fetching books:', error);
        toast({
          title: "Error",
          description: "Failed to load book resources. Using sample data instead.",
          variant: "destructive"
        });
        // Fallback to mock data
        setBooks(getMockBookData(topic));
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [topic, toast]);
  
  return (
    <div className="mt-6">
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, index) => (
            <Card key={`skeleton-${index}`} className="p-4 space-y-3">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-2/3 h-4" />
              <Skeleton className="w-1/3 h-4" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <Card key={book.id} className="p-4" hoverable>
              <div className="space-y-2">
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-muted-foreground">by {book.author}</p>
                <div className="flex items-center text-sm">
                  <span className="text-amber-500 mr-1">★</span>
                  <span>{book.rating} • {book.year}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export const OnlineResource: React.FC<ResourceProps> = ({ topic }) => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_query: `${topic} online courses and educational websites` }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch online resources');
        }
        
        const data: SearchResponse = await response.json();
        
        // Parse the educational_resources for website information
        const resourcesText = data.educational_resources;
        
        // Extract website information from text - basic implementation
        const websiteMatches = resourcesText.match(/\*\*(.*?)\*\*/g);
        const linkMatches = resourcesText.match(/\((https?:\/\/[^\s)]+)\)/g);
        
        const formattedResources = websiteMatches ? 
          websiteMatches.map((match, index) => {
            const title = match.replace(/\*\*/g, '');
            const link = linkMatches && linkMatches[index] ? 
              linkMatches[index].replace(/\(|\)/g, '') : '#';
            
            return {
              id: `resource-${index}`,
              title: title,
              provider: 'From API',
              type: 'Online Resource',
              duration: 'N/A',
              link: link,
            };
          }) : [];
        
        setResources(formattedResources.length > 0 ? formattedResources : getMockOnlineData(topic));
      } catch (error) {
        console.error('Error fetching online resources:', error);
        toast({
          title: "Error",
          description: "Failed to load online resources. Using sample data instead.",
          variant: "destructive"
        });
        // Fallback to mock data
        setResources(getMockOnlineData(topic));
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, [topic, toast]);
  
  return (
    <div className="mt-6">
      {loading ? (
        <div className="space-y-4">
          {Array(4).fill(0).map((_, index) => (
            <Card key={`skeleton-${index}`} className="p-4">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="w-full h-5" />
                  <Skeleton className="w-1/3 h-4" />
                  <Skeleton className="w-1/2 h-4" />
                </div>
                <Skeleton className="w-20 h-10 rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((resource) => (
            <Card key={resource.id} className="p-4" hoverable>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{resource.provider}</span> • {resource.type}
                  </p>
                  {resource.duration !== 'N/A' && (
                    <p className="text-sm text-muted-foreground">Duration: {resource.duration}</p>
                  )}
                </div>
                
                <Button asChild size="sm">
                  <a 
                    href={resource.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center"
                  >
                    Access
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Create a new search component to allow users to search for resources
export const ResourceSearch: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for resources..."
        className="flex-1"
      />
      <Button type="submit">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

// Keep the mock data functions for fallback
const getMockVideoData = (topic: string) => {
  const videos = [
    {
      id: '1',
      title: `Understanding ${topic} - Comprehensive Guide`,
      channel: 'LearningMastery',
      views: '1.2M views',
      thumbnail: 'https://placehold.co/320x180/3b82f6/ffffff?text=Video+1',
      duration: '32:15',
      link: '#'
    },
    {
      id: '2',
      title: `Advanced ${topic} Concepts Explained`,
      channel: 'AcademicExcellence',
      views: '856K views',
      thumbnail: 'https://placehold.co/320x180/3b82f6/ffffff?text=Video+2',
      duration: '48:05',
      link: '#'
    },
    {
      id: '3',
      title: `${topic} Made Simple - Quick Tutorial`,
      channel: 'StudyPro',
      views: '1.5M views',
      thumbnail: 'https://placehold.co/320x180/3b82f6/ffffff?text=Video+3',
      duration: '15:42',
      link: '#'
    },
    {
      id: '4',
      title: `${topic} for Beginners - Step by Step`,
      channel: 'EduChannel',
      views: '623K views',
      thumbnail: 'https://placehold.co/320x180/3b82f6/ffffff?text=Video+4',
      duration: '26:18',
      link: '#'
    }
  ];
  
  return videos;
};

const getMockBookData = (topic: string) => {
  const books = [
    {
      id: '1',
      title: `Essential ${topic} Handbook`,
      author: 'Dr. Robert Anderson',
      rating: 4.8,
      year: 2022,
    },
    {
      id: '2',
      title: `${topic}: A Comprehensive Approach`,
      author: 'Emily N. Morgan',
      rating: 4.5,
      year: 2021,
    },
    {
      id: '3',
      title: `Understanding ${topic} - From Theory to Practice`,
      author: 'James P. Smith',
      rating: 4.7,
      year: 2023,
    },
    {
      id: '4',
      title: `Advanced ${topic} Concepts`,
      author: 'David R. Williams',
      rating: 4.6,
      year: 2020,
    },
    {
      id: '5',
      title: `${topic} for Academic Excellence`,
      author: 'Sarah J. Thompson',
      rating: 4.9,
      year: 2023,
    },
    {
      id: '6',
      title: `The Complete Guide to ${topic}`,
      author: 'Michael C. Brown',
      rating: 4.4,
      year: 2021,
    }
  ];
  
  return books;
};

const getMockOnlineData = (topic: string) => {
  const resources = [
    {
      id: '1',
      title: `${topic} - Online Course`,
      provider: 'Coursera',
      type: 'Course',
      duration: '8 weeks',
      link: '#'
    },
    {
      id: '2',
      title: `Interactive ${topic} Tutorials`,
      provider: 'Khan Academy',
      type: 'Interactive',
      duration: 'Self-paced',
      link: '#'
    },
    {
      id: '3',
      title: `${topic} - Practice Problems`,
      provider: 'MIT OpenCourseware',
      type: 'Practice',
      duration: 'N/A',
      link: '#'
    },
    {
      id: '4',
      title: `${topic} - Expert Articles`,
      provider: 'ResearchGate',
      type: 'Articles',
      duration: 'N/A',
      link: '#'
    }
  ];
  
  return resources;
};

// Main Resources Container Component
export const ResourcesContainer: React.FC = () => {
  const [topic, setTopic] = useState('Mathematics');
  
  const handleSearch = (query: string) => {
    setTopic(query);
  };
  
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Educational Resources</h1>
      
      <ResourceSearch onSearch={handleSearch} />
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <Youtube className="mr-2" /> Video Resources for {topic}
          </h2>
          <VideoResource topic={topic} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <Book className="mr-2" /> Book Resources for {topic}
          </h2>
          <BookResource topic={topic} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <Globe className="mr-2" /> Online Resources for {topic}
          </h2>
          <OnlineResource topic={topic} />
        </div>
      </div>
    </div>
  );
};