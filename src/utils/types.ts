import { AI } from "@raycast/api";

export interface AIPreferences {
  aiModel: AI.Model;
  style: string;
}

export interface AIRequestOptions {
  model?: AI.Model;
  style?: string;
}

export interface Suggestion {
  text: string;
  type: "completion" | "polish";
}

export interface WritingState {
  input: string;
  suggestions: Suggestion[];
  isLoading: boolean;
  error?: string;
}

export type SupportedModel = 
  | "openai-gpt-4o"
  | "openai-gpt-4o-mini"
  | "anthropic-claude-sonnet"
  | "anthropic-claude-haiku"
  | "llama3.1-8b
  | "llama3.1-70b"; 