import { AI, getPreferenceValues } from "@raycast/api";
import { AIPreferences, AIRequestOptions, WritingStyle, SupportedModel } from "../utils/types";
import { modelInfo } from "../utils/modelInfo";
import { handleError } from "../utils/errorHandler";

// 添加一个辅助函数来处理模型类型转换
function convertToAIModel(model: SupportedModel): AI.Model {
  const modelMap: Record<SupportedModel, AI.Model> = {
    [SupportedModel.OpenAIGPT4o]: AI.Model.OpenAI_GPT4,
    [SupportedModel.OpenAIGPT4oMini]: AI.Model.OpenAI_GPT4,
    [SupportedModel.AnthropicClaudeSonnet]: AI.Model.Anthropic_Claude_Sonnet,
    [SupportedModel.AnthropicClaudeHaiku]: AI.Model.Anthropic_Claude_Haiku,
    [SupportedModel.Llama3_1_8b]: AI.Model.OpenAI_GPT4, // 临时映射
    [SupportedModel.Llama3_1_70b]: AI.Model.OpenAI_GPT4, // 临时映射
  };
  return modelMap[model];
}

function getAIOptions(options?: AIRequestOptions): AI.AskOptions {
  const preferences = getPreferenceValues<AIPreferences>();
  const model = options?.model ? 
    convertToAIModel(options.model) : 
    convertToAIModel(preferences.aiModel);
  
  return { model };
}

function getStylePrompt(style: WritingStyle): string {
  const stylePrompts: Record<WritingStyle, string> = {
    [WritingStyle.Professional]: "in a professional and formal tone",
    [WritingStyle.Casual]: "in a casual and friendly tone",
    [WritingStyle.Academic]: "in an academic and scholarly tone",
    [WritingStyle.Creative]: "in a creative and engaging tone",
  };
  return stylePrompts[style] || stylePrompts[WritingStyle.Professional];
}

export async function getWordCompletions(input: string, options?: AIRequestOptions): Promise<string[]> {
  const preferences = getPreferenceValues<AIPreferences>();
  const prompt = `Complete this word: "${input}" ${getStylePrompt(preferences.style)}. Return only the completed word, no explanation.`;
  try {
    const response = await AI.ask(prompt, getAIOptions(options));
    return [response.trim()];
  } catch (error) {
    handleError(error, "word completion");
    throw error;
  }
}

export async function polishText(text: string, options?: AIRequestOptions): Promise<string> {
  const preferences = getPreferenceValues<AIPreferences>();
  const prompt = `Polish this English text ${getStylePrompt(preferences.style)}: "${text}". Return only the polished text, no explanation.`;
  try {
    const response = await AI.ask(prompt, getAIOptions(options));
    return response.trim();
  } catch (error) {
    handleError(error, "text polishing");
    throw error;
  }
}

export async function translateMixedText(text: string, options?: AIRequestOptions): Promise<string> {
  const preferences = getPreferenceValues<AIPreferences>();
  const prompt = `Translate this Chinese-English mixed text to proper English ${getStylePrompt(preferences.style)}: "${text}". Return only the translated text, no explanation.`;
  try {
    const response = await AI.ask(prompt, getAIOptions(options));
    return response.trim();
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
    "llama3.1-70b": 'Llama3.1 70B'
  };

  return {
    model: preferences.aiModel,
    modelName: modelNames[preferences.aiModel] || 'Unknown Model',
    style: preferences.style,
  };
} 