import { AI, getPreferenceValues } from "@raycast/api";
import { AIPreferences, AIRequestOptions, SupportedModel } from "../utils/types";
import { handleError } from "../utils/errorHandler";
import * as openRouter from "./openrouter";
import { Message, getWordCompletionPrompt, getPolishPrompt, getTranslationPrompt } from "../utils/prompts";

// 添加一个辅助函数来处理模型类型转换
function convertToAIModel(model: SupportedModel): AI.Model {
  const modelMap: Record<SupportedModel, AI.Model> = {
    [SupportedModel.OpenAIGPT4o]: AI.Model.OpenAI_GPT4,
    [SupportedModel.OpenAIGPT4oMini]: AI.Model.OpenAI_GPT4,
    [SupportedModel.AnthropicClaudeSonnet]: AI.Model.Anthropic_Claude_Sonnet,
    [SupportedModel.AnthropicClaudeHaiku]: AI.Model.Anthropic_Claude_Haiku,
    [SupportedModel.Llama3_1_8b]: AI.Model.OpenAI_GPT4,
    [SupportedModel.Llama3_1_70b]: AI.Model.OpenAI_GPT4,
    [SupportedModel.GeminiFlash]: AI.Model.OpenAI_GPT4,
  };
  return modelMap[model];
}

async function processWithModel(messages: Message[], options?: AIRequestOptions): Promise<string> {
  const preferences = getPreferenceValues<AIPreferences>();
  const model = options?.model || preferences.aiModel;

  if (model === SupportedModel.GeminiFlash) {
    return await openRouter.processWithAI(messages);
  }

  const aiOptions = {
    model: convertToAIModel(model),
  };

  const response = await AI.ask(messages[messages.length - 1].content, aiOptions);
  return response.trim();
}

export async function getWordCompletions(input: string, options?: AIRequestOptions): Promise<string[]> {
  const preferences = getPreferenceValues<AIPreferences>();
  
  try {
    const messages = getWordCompletionPrompt(input, preferences.style);
    const response = await processWithModel(messages, options);
    return [response];
  } catch (error) {
    handleError(error, "word completion");
    throw error;
  }
}

export async function polishText(text: string, options?: AIRequestOptions): Promise<string> {
  const preferences = getPreferenceValues<AIPreferences>();
  
  try {
    const messages = getPolishPrompt(text, preferences.style);
    return await processWithModel(messages, options);
  } catch (error) {
    handleError(error, "text polishing");
    throw error;
  }
}

export async function translateMixedText(text: string, options?: AIRequestOptions): Promise<string> {
  const preferences = getPreferenceValues<AIPreferences>();
  
  try {
    const messages = getTranslationPrompt(text, preferences.style);
    return await processWithModel(messages, options);
  } catch (error) {
    handleError(error, "translation");
    throw error;
  }
}

export function getCurrentAISettings() {
  const preferences = getPreferenceValues<AIPreferences>();
  const modelNames: Record<string, string> = {
    "openai-gpt-4o": 'GPT-4o',
    "openai-gpt-4o-mini": 'GPT4omini',
    "anthropic-claude-sonnet": 'Claude Sonnet 3.5',
    "anthropic-claude-haiku": 'Claude Haiku 3.5',
    "llama3.1-8b": 'Llama3.1 8B',
    "llama3.1-70b": 'Llama3.1 70B',
    "gemini-1.5-flash": 'Gemini 1.5 Flash'
  };

  return {
    model: preferences.aiModel,
    modelName: modelNames[preferences.aiModel] || 'Unknown Model',
    style: preferences.style,
  };
} 