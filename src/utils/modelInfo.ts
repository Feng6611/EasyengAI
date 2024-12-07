import { Icon } from "@raycast/api";
import { SupportedModel } from "./types";

export interface ModelDetails {
  name: string;
  provider: string;
  icon: Icon;
}

export const modelInfo: Record<SupportedModel, ModelDetails> = {
  [SupportedModel.OpenAIGPT4o]: {
    name: "GPT4o",
    provider: "OpenAI",
    icon: Icon.Stars,
  },
  [SupportedModel.OpenAIGPT4oMini]: {
    name: "GPT4omini",
    provider: "OpenAI",
    icon: Icon.Stars,
  },
  [SupportedModel.AnthropicClaudeSonnet]: {
    name: "Claude Sonnet 3.5",
    provider: "Anthropic",
    icon: Icon.Person,
  },
  [SupportedModel.AnthropicClaudeHaiku]: {
    name: "Claude Haiku 3.5",
    provider: "Anthropic",
    icon: Icon.Person,
  },
  [SupportedModel.Llama3_1_8b]: {
    name: "Llama3.1 8B",
    provider: "Meta",
    icon: Icon.Terminal,
  },
  [SupportedModel.Llama3_1_70b]: {
    name: "Llama3.1 70B",
    provider: "Meta",
    icon: Icon.Terminal,
  },
};

export { SupportedModel }; 