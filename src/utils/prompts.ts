import { WritingStyle } from "./types";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export function getStylePrompt(style: WritingStyle): string {
  const stylePrompts: Record<WritingStyle, string> = {
    [WritingStyle.Professional]: "in a professional and formal tone",
    [WritingStyle.Casual]: "in a casual and friendly tone",
    [WritingStyle.Academic]: "in an academic and scholarly tone",
    [WritingStyle.Creative]: "in a creative and engaging tone",
  };
  return stylePrompts[style] || stylePrompts[WritingStyle.Professional];
}

export function getWordCompletionPrompt(input: string, style: WritingStyle): Message[] {
  return [
    {
      role: "system",
      content: "You are a professional English writing assistant. Complete the word naturally and appropriately."
    },
    {
      role: "user",
      content: `Complete this word: "${input}" ${getStylePrompt(style)}. Return only the completed word, no explanation.`
    }
  ];
}

export function getPolishPrompt(text: string, style: WritingStyle): Message[] {
  return [
    {
      role: "system",
      content: "You are a professional English writing assistant. Polish the text to make it more natural and appropriate."
    },
    {
      role: "user",
      content: `Polish this English text ${getStylePrompt(style)}: "${text}". Return only the polished text, no explanation.`
    }
  ];
}

export function getTranslationPrompt(text: string, style: WritingStyle): Message[] {
  return [
    {
      role: "system",
      content: "You are a professional translator. Translate the mixed text to proper English."
    },
    {
      role: "user",
      content: `Translate this Chinese-English mixed text to proper English ${getStylePrompt(style)}: "${text}". Return only the translated text, no explanation.`
    }
  ];
} 