export interface Message {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    sentiment?: 'positive' | 'negative' | 'neutral';
  }
  
  export interface ChatSession {
    id: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface User {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
    type: 'guest' | 'registered';
    since: Date;
  }
  
  export interface RelatedArticle {
    id: string;
    title: string;
    url: string;
    relevanceScore: number;
  }