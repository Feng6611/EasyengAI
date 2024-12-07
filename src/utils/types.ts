import { AI } from "@raycast/api";

export enum SupportedModel {
  OpenAIGPT4o = "openai-gpt-4o",
  OpenAIGPT4oMini = "openai-gpt-4o-mini",
  AnthropicClaudeSonnet = "anthropic-claude-sonnet",
  AnthropicClaudeHaiku = "anthropic-claude-haiku",
  Llama3_1_8b = "llama3.1-8b",
  Llama3_1_70b = "llama3.1-70b",
}

export enum WritingStyle {
  Professional = "professional",
  Casual = "casual",
  Academic = "academic",
  Creative = "creative",
}

export interface AIPreferences {
  aiModel: SupportedModel;
  style: WritingStyle;
}

export interface AIRequestOptions {
  model?: SupportedModel;
  style?: WritingStyle;
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