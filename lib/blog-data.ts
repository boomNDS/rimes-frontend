export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    content: `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Next.js 15 brings exciting new features and improvements that make building web applications even more enjoyable and efficient.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"What's New in Next.js 15","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h3"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"The latest version includes significant performance optimizations that make your applications faster and more responsive. The new compiler improvements reduce bundle sizes and improve build times.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
    author: "Sarah Johnson",
    category: "Technology",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "The Art of Minimalist Living",
    content: `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Minimalism isn't just about having fewer possessions—it's about making room for what truly matters in your life.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Understanding Minimalism","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
    author: "Michael Chen",
    category: "Lifestyle",
    createdAt: "2024-01-12T14:30:00Z",
  },
  {
    id: "3",
    title: "Hidden Gems of Southeast Asia",
    content: `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Southeast Asia is full of incredible destinations that most travelers never discover. Here are some hidden gems worth adding to your itinerary.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
    author: "Emma Rodriguez",
    category: "Travel",
    createdAt: "2024-01-10T09:15:00Z",
  },
];
