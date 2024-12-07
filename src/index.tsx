import { ActionPanel, Action, List, showToast, Toast, Icon } from "@raycast/api";
import { useState, useEffect, useCallback, useMemo } from "react";
import { processInput } from "./services/wordCompletion";
import { polishText } from "./services/ai";
import { Suggestion, SupportedModel, WritingStyle } from "./utils/types";
import { debounce, handleError } from "./utils/helpers";
import { modelInfo } from "./utils/modelInfo";

// Debug: Log available models
// console.log("Available AI Models:", Object.keys(AI.Model));

export default function Command() {
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentModel, setCurrentModel] = useState<SupportedModel>(SupportedModel.OpenAIGPT4o);
  const [isModelSwitching, setIsModelSwitching] = useState<boolean>(false);

  const debouncedProcessInput = useMemo(
    () =>
      debounce(async (text: string) => {
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
          handleError(error);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [currentModel]
  );

  useEffect(() => {
    debouncedProcessInput(input);
  }, [input, debouncedProcessInput]);

  const handlePolish = useCallback(async (text: string) => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);
      const polished = await polishText(text, {
        model: currentModel,
        style: WritingStyle.Professional,
      });

      setSuggestions((prev) => [
        ...prev,
        {
          text: polished,
          type: "polish",
        },
      ]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentModel]);

  const handleModelSwitch = useCallback(async (model: SupportedModel) => {
    setIsModelSwitching(true);
    try {
      setCurrentModel(model);
    } finally {
      setIsModelSwitching(false);
    }
  }, []);

  const currentModelInfo = useMemo(() => modelInfo[currentModel], [currentModel]);

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={`Start typing to get writing suggestions using ${currentModelInfo.name}...`}
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
              {Object.values(SupportedModel).map((model: SupportedModel) => {
                const info = modelInfo[model];
                return (
                  <Action
                    key={model}
                    title={`${info.name} - ${info.provider}`}
                    icon={info.icon}
                    onAction={() => handleModelSwitch(model)}
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
            subtitle={`${currentModelInfo.name} - ${currentModelInfo.provider}`}
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
                    {Object.values(SupportedModel).map((model: SupportedModel) => {
                      const info = modelInfo[model];
                      return (
                        <Action
                          key={model}
                          title={`${info.name} - ${info.provider}`}
                          icon={info.icon}
                          onAction={() => handleModelSwitch(model)}
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