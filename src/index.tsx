import { ActionPanel, Action, List, showToast, Toast, Icon, AI } from "@raycast/api";
import { useState, useEffect } from "react";
import { processInput } from "./services/wordCompletion";
import { polishText } from "./services/ai";
import { Suggestion } from "./utils/types";
import { debounce, handleError } from "./utils/helpers";

// Debug: Log available models
console.log("Available AI Models:", Object.keys(AI.Model));

const modelInfo: Record<string, { name: string; provider: string; icon: Icon }> = {
  "openai-gpt-4o": { 
    name: "GPT4o",
    provider: "OpenAI",
    icon: Icon.Stars
  },
  "openai-gpt-4o-mini": {
    name: "GPT4omini",
    provider: "OpenAI", 
    icon: Icon.Stars
  },
  "anthropic-claude-sonnet": {
    name: "Claude Sonnet 3.5",
    provider: "Anthropic",
    icon: Icon.Person
  },
  "anthropic-claude-haiku": {
    name: "Claude Haiku 3.5",
    provider: "Anthropic",
    icon: Icon.Person
  },
  "llama3.1-8b": {
    name: "Llama3.1 8B",
    provider: "Meta",
    icon: Icon.Terminal
  },
  "llama3.1-70b": {
    name: "Llama3.1 70B",
    provider: "Meta",
    icon: Icon.Terminal
  }
};

const getModelInfo = (model: AI.Model): { name: string; provider: string; icon: Icon } => {
  console.log("Current model:", model);
  
  const result = modelInfo[model] || { name: "Unknown Model", provider: "Unknown", icon: Icon.QuestionMark };
  console.log("Model info result:", result);
  return result;
};

export default function Command() {
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentModel, setCurrentModel] = useState<AI.Model>("openai-gpt-4o" as AI.Model);
  const [isModelSwitching, setIsModelSwitching] = useState<boolean>(false);

  const debouncedProcessInput = debounce(async (text: string) => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await processInput(text, { model: currentModel });
      setSuggestions(
        results.map((text) => ({
          text,
          type: "completion",
        }))
      );
    } catch (error) {
      if (error instanceof Error) {
        handleError(error);
      } else {
        showToast({
          style: Toast.Style.Failure,
          title: "Processing Failed",
          message: "Unable to process input text",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedProcessInput(input);
  }, [input, currentModel]);

  const handlePolish = async (text: string) => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);
      const polished = await polishText(text, {
        model: currentModel,
        style: "professional"
      });
      
      setSuggestions([
        ...suggestions,
        {
          text: polished,
          type: "polish",
        },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        handleError(error);
      } else {
        showToast({
          style: Toast.Style.Failure,
          title: "Polish Failed",
          message: "Unable to polish text",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelSwitch = async (model: AI.Model) => {
    setIsModelSwitching(true);
    try {
      await setCurrentModel(model);
    } finally {
      setIsModelSwitching(false);
    }
  };

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={`Start typing to get writing suggestions using ${getModelInfo(currentModel).name}...`}
      onSearchTextChange={setInput}
      throttle
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <ActionPanel.Submenu
              title="Switch AI Model"
              icon={Icon.LightBulb}
              shortcut={{ modifiers: ["cmd"], key: "m" }}
            >
              {[
                "openai-gpt-4o",
                "openai-gpt-4o-mini",
                "anthropic-claude-sonnet",
                "anthropic-claude-haiku",
                "llama3.1-8b",
                "llama3.1-70b"
              ].map((model) => {
                const modelInfo = getModelInfo(model as AI.Model);
                return (
                  <Action
                    key={model}
                    title={`${modelInfo.name} - ${modelInfo.provider}`}
                    icon={modelInfo.icon}
                    onAction={() => handleModelSwitch(model as AI.Model)}
                  />
                );
              })}
            </ActionPanel.Submenu>
          </ActionPanel.Section>
        </ActionPanel>
      }
    >
      <List.Section title="Writing Suggestions">
        {suggestions.map((suggestion, index) => (
          <List.Item
            key={index}
            title={suggestion.text}
            icon={suggestion.type === "polish" ? Icon.Wand : Icon.Text}
            subtitle={`${getModelInfo(currentModel).name} - ${getModelInfo(currentModel).provider}`}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action.CopyToClipboard
                    title="Copy to Clipboard"
                    content={suggestion.text}
                    shortcut={{ modifiers: ["cmd"], key: "c" }}
                  />
                  <Action
                    title="Polish Text"
                    icon={Icon.Wand}
                    onAction={() => handlePolish(suggestion.text)}
                    shortcut={{ modifiers: ["cmd"], key: "p" }}
                  />
                </ActionPanel.Section>
                <ActionPanel.Section title="Switch AI Model">
                  <ActionPanel.Submenu
                    title="Switch AI Model"
                    icon={Icon.LightBulb}
                    shortcut={{ modifiers: ["cmd"], key: "m" }}
                  >
                    {[
                      "openai-gpt-4o",
                      "openai-gpt-4o-mini",
                      "anthropic-claude-sonnet",
                      "anthropic-claude-haiku",
                      "llama3.1-8b",
                      "llama3.1-70b"
                    ].map((model) => {
                      const modelInfo = getModelInfo(model as AI.Model);
                      return (
                        <Action
                          key={model}
                          title={`${modelInfo.name} - ${modelInfo.provider}`}
                          icon={modelInfo.icon}
                          onAction={() => handleModelSwitch(model as AI.Model)}
                        />
                      );
                    })}
                  </ActionPanel.Submenu>
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
} 