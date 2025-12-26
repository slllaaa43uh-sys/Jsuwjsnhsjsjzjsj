
export interface User {
  id: string;
  _id?: string;
  name: string;
  avatar: string;
}

export interface Post {
  id: string;
  _id?: string;
  user: User;
  timeAgo: string;
  content: string;
  image?: string;
  media?: Array<{
    url: string;
    type: 'image' | 'video';
    thumbnail?: string;
  }>;
  likes: number;
  comments: number;
  shares: number;
  repostsCount?: number;
  jobStatus?: 'open' | 'negotiating' | 'hired';
  title?: string;
  type?: string;
  location?: string;
  category?: string;
  isFeatured?: boolean;
  contactPhone?: string;
  contactEmail?: string;
  contactMethods?: string[];
  isLiked?: boolean;
  isShort?: boolean;
  reactions?: Array<{ user: string; type: string }>;
  originalPost?: Post; // Added for Repost functionality
}

export interface Story {
  _id: string;
  text?: string;
  backgroundColor?: string;
  media?: {
    url: string;
    type: 'image' | 'video';
  };
  trimData?: {
    start: number;
    end: number;
  };
  createdAt: string;
  views?: Array<{
    user: User | string;
    viewedAt: string;
  }>;
  user: User;
}

export interface StoryGroup {
  user: User;
  stories: Story[];
  hasUnseen: boolean;
  isUser: boolean;
}
