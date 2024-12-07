import { ActionPanel, Action, Detail, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { testConnection } from "./services/openrouter";
import { SupportedModel } from "./utils/types";
import { getAPIKeys } from "./utils/env";

interface TestState {
  isLoading: boolean;
  result?: {
    success: boolean;
    message: string;
    details?: {
      apiKey?: string;
      model?: string;
      response?: string;
      error?: string;
    };
  };
}

export default function Command() {
  const [state, setState] = useState<TestState>({
    isLoading: true
  });

  async function runTest() {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // 获取并检查 API Key
      const { openrouterApiKey } = getAPIKeys();
      if (!openrouterApiKey) {
        showToast({
          style: Toast.Style.Failure,
          title: "API Key 未配置",
          message: "请先配置 OpenRouter API Key"
        });
        return;
      }

      const result = await testConnection(SupportedModel.GeminiFlash);
      setState({ isLoading: false, result });

      showToast({
        style: result.success ? Toast.Style.Success : Toast.Style.Failure,
        title: result.message,
        message: result.details?.error || result.details?.response || ""
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "未知错误";
      setState({
        isLoading: false,
        result: {
          success: false,
          message: "测试失败",
          details: { error: errorMessage }
        }
      });

      showToast({
        style: Toast.Style.Failure,
        title: "测试失败",
        message: errorMessage
      });
    }
  }

  useEffect(() => {
    runTest();
  }, []);

  function getMarkdown() {
    if (!state.result) {
      return "正在加载...";
    }

    const { success, message, details } = state.result;
    const icon = success ? "✅" : "❌";
    
    let markdown = `# 测试结果 ${icon}\n\n`;
    markdown += `## 状态\n${message}\n\n`;

    if (details) {
      markdown += "## 详细信息\n\n";
      
      if (details.model) {
        markdown += `- **模型**: \`${details.model}\`\n`;
      }
      
      if (details.response) {
        markdown += `- **响应**: \`${details.response}\`\n`;
      }
      
      if (details.error) {
        markdown += `- **错误**: \`${details.error}\`\n`;
      }
      
      // 检查 API Key 配置
      const { openrouterApiKey } = getAPIKeys();
      markdown += `\n## API 配置\n`;
      markdown += `- **API Key**: ${openrouterApiKey ? "���配置 ✅" : "未配置 ❌"}\n`;
    }

    return markdown;
  }

  return (
    <Detail
      markdown={getMarkdown()}
      isLoading={state.isLoading}
      actions={
        <ActionPanel>
          <Action
            title="重新测试"
            onAction={runTest}
          />
        </ActionPanel>
      }
    />
  );
} 