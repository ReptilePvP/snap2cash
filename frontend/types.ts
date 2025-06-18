
import React from 'react';

export interface AnalysisResult {
  id: string;
  title: string;
  description: string; // Markdown
  value: string; // e.g., "$25–$45"
  aiExplanation: string; // Markdown
  visualMatches?: { title: string; link: string; source_icon?: string; thumbnail?: string }[];
  imageCompare?: string; // URL
  imageUrl?: string; // Uploaded image URL (base64 or blob)
  apiProvider: ApiProvider;
  timestamp: number;
}

export interface ScanHistoryItem extends AnalysisResult {
  isFavorite: boolean;
}

export enum ApiProvider {
  GEMINI = 'Gemini',
  SERPAPI = 'SerpAPI',
  SEARCHAPI = 'SearchAPI',
}

export interface NavItem {
  path: string;
  name: string;
  icon: React.ElementType; // Phosphor icon component
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface ToastContextType {
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}