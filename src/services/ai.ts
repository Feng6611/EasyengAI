import { AI, getPreferenceValues } from "@raycast/api";
import { AIPreferences, AIRequestOptions } from "../utils/types";

function getAIOptions(options?: AIRequestOptions): AI.AskOptions {
  const preferences = getPreferenceValues<AIPreferences>();
  return {
    model: options?.model || preferences.aiModel
  };
}

function getStylePrompt(style: string): string {
  const stylePrompts = {
    professional: "in a professional and formal tone",
    casual: "in a casual and friendly tone",
    academic: "in an academic and scholarly tone",
    creative: "in a creative and engaging tone",
  };
  return stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.professional;
}

export async function getWordCompletions(input: string, options?: AIRequestOptions): Promise<string[]> {
  const preferences = getPreferenceValues<AIPreferences>();
  const prompt = `Complete this word: "${input}" ${getStylePrompt(preferences.style)}. Return only the completed word, no explanation.`;
  try {
    const response = await AI.ask(prompt, {
      model: options?.model || preferences.aiModel as AI.Model
    });
    return [response.trim()];
  } catch (error) {
    console.error("Error in word completion:", error);
    throw error;
  }
}

export async function polishText(text: string, options?: AIRequestOptions): Promise<string> {
  const preferences = getPreferenceValues<AIPreferences>();
  const prompt = `Polish this English text ${getStylePrompt(preferences.style)}: "${text}". Return only the polished text, no explanation.`;
  try {
    const response = await AI.ask(prompt, {
      model: options?.model || preferences.aiModel as AI.Model
    });
    return response.trim();
  } catch (error) {
    console.error("Error in text polishing:", error);
    throw error;
  }
}

export async function translateMixedText(text: string, options?: AIRequestOptions): Promise<string> {
  const preferences = getPreferenceValues<AIPreferences>();
  const prompt = `Translate this Chinese-English mixed text to proper English ${getStylePrompt(preferences.style)}: "${text}". Return only the translated text, no explanation.`;
  try {
    const response = await AI.ask(prompt, {
      model: options?.model || preferences.aiModel as AI.Model
    });
    return response.trim();
  } catch (error) {
    console.error("Error in translation:", error);
    throw error;
  }
}

export function getCurrentAISettings() {
  const preferences = getPreferenceValues<AIPreferences>();
  const modelNames = {
    [AI.Model.OpenAI_GPT4]: 'GPT-4',
    [AI.Model.Anthropic_Claude_Sonnet]: 'Claude Sonnet'
  };
  
  return {
    model: preferences.aiModel,
    modelName: modelNames[preferences.aiModel as keyof typeof modelNames] || 'Unknown Model',
    style: preferences.style
  };
} 