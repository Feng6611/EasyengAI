import { getWordCompletions, polishText, translateMixedText } from "./ai";
import { AIRequestOptions } from "../utils/types";

// 检测输入是否包含中文
function containsChinese(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

// 检测输入是否为单词补全请求
function isWordCompletion(text: string): boolean {
  return /^[a-zA-Z]{2,}$/.test(text);
}

// 主要处理函数
export async function processInput(input: string, options?: AIRequestOptions): Promise<string[]> {
  try {
    if (!input.trim()) {
      return [];
    }

    // 如果包含中文，进行中英混合文本翻译
    if (containsChinese(input)) {
      const translated = await translateMixedText(input, options);
      return [translated];
    }

    // 如果是单词补全请求
    if (isWordCompletion(input)) {
      return await getWordCompletions(input, options);
    }

    // 如果是句子，提供补全和润色建议
    const polished = await polishText(input, options);
    return [input, polished];

  } catch (error) {
    console.error("Error processing input:", error);
    throw error;
  }
} 