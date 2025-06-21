export interface AnalysisResult {
  id: string;
  title: string;
  description: string;
  value: string;
  aiExplanation: string;
  visualMatches?: VisualMatch[];
  imageCompare?: string;
  imageUrl?: string;
  apiProvider: ApiProvider;
  timestamp: number;
}

export interface VisualMatch {
  title: string;
  link: string;
  source_icon?: string;
  thumbnail?: string;
}

export interface ScanHistoryItem extends AnalysisResult {
  isFavorite: boolean;
}

export enum ApiProvider {
  GEMINI = 'Gemini',
  SERPAPI = 'SerpAPI',
  SEARCHAPI = 'SearchAPI',
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ColorScheme;
}

export interface ColorScheme {
  primary: string;
  primaryDark: string;
  onPrimary: string; // Color for text/icons on primary background
  secondary: string;
  onSecondary: string; // Color for text/icons on secondary background
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  onSuccess: string; // Color for text/icons on success background
  error: string;
  warning: string;
  info: string;
  card: string;
}