import { SupportedModel } from "../utils/types";
import { handleError } from "../utils/errorHandler";
import { getAPIKeys, validateAPIKeys } from "../utils/env";
import { Message } from "../utils/prompts";
import fetch from "node-fetch";

interface OpenRouterResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const GEMINI_MODEL = "google/gemini-flash-1.5";

async function makeOpenRouterRequest(messages: Message[], debug: boolean = false) {
    try {
        validateAPIKeys();
        const { openrouterApiKey } = getAPIKeys();

        if (debug) {
            console.log('Debug - Request details:', {
                url: OPENROUTER_API_URL,
                model: GEMINI_MODEL,
                messages: messages
            });
        }

        const requestBody = {
            model: GEMINI_MODEL,
            messages: messages,
            stream: false,
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0,
            provider: {
                order: ["Google"],
                allow_fallbacks: false
            }
        };

        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openrouterApiKey}`,
                "HTTP-Referer": "https://raycast.com/",
                "X-Title": "EasyEng AI"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText,
                requestBody: requestBody
            });
            throw new Error(`OpenRouter API error: ${response.statusText}\n${errorText}`);
        }

        const data = await response.json() as OpenRouterResponse;
        
        if (debug) {
            console.log('Debug - Response:', JSON.stringify(data, null, 2));
        }
        
        return data.choices[0]?.message?.content || "";
    } catch (error) {
        console.error('Request error:', error);
        handleError(error, "OpenRouter API request");
        throw error;
    }
}

export async function processWithAI(messages: Message[]): Promise<string> {
    return await makeOpenRouterRequest(messages);
}

interface TestResult {
    success: boolean;
    message: string;
    details?: {
        apiKey?: string;
        model?: string;
        response?: string;
        error?: string;
    };
}

// 测试连接
export async function testConnection(): Promise<TestResult> {
    try {
        validateAPIKeys();
        const { openrouterApiKey } = getAPIKeys();
        
        // 检查 API Key
        if (!openrouterApiKey) {
            return {
                success: false,
                message: "API Key 未配置",
                details: {
                    error: "请在环境变量或 Raycast 偏好设置中配置 OpenRouter API Key"
                }
            };
        }

        const messages: Message[] = [
            {
                role: "system",
                content: "You are a helpful assistant."
            },
            {
                role: "user",
                content: "Please respond with 'Connection successful!' if you receive this message."
            }
        ];

        const response = await makeOpenRouterRequest(messages, true);
        
        return {
            success: true,
            message: "连接测试成功",
            details: {
                model: GEMINI_MODEL,
                response: response
            }
        };
    } catch (error) {
        console.error('Test connection error:', error);
        return {
            success: false,
            message: "连接测试失败",
            details: {
                error: error instanceof Error ? error.message : "未知错误"
            }
        };
    }
} 