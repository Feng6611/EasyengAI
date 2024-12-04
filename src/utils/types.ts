import { AI } from "@raycast/api";

export interface Suggestion {
  text: string;
  type: 'completion' | 'polish' | 'translation';
}

export interface WritingState {
  input: string;
  suggestions: Suggestion[];
  isLoading: boolean;
  error?: string;
}

export type AIModel = AI.Model;

export interface AIPreferences {
  aiModel: AIModel;
  style: 'professional' | 'casual' | 'academic' | 'creative';
}

export interface AIRequestOptions {
  model?: AIModel;
  style?: 'professional' | 'casual' | 'academic' | 'creative';
} 