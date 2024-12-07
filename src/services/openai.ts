import OpenAI from "openai";
import { getPreferenceValues } from "@raycast/api";
import { SupportedModel } from "../utils/types";
import { handleError } from "../utils/errorHandler";

interface Preferences {
  apiKey: string;
}

const preferences = getPreferenceValues<Preferences>();

const openai = new OpenAI({
  apiKey: preferences.apiKey,
});

export async function polishText(text: string, model: SupportedModel): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a professional English writing assistant. Polish the following text to make it more professional and natural.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return response.choices[0]?.message?.content || text;
  } catch (error) {
    handleError(error, "polish text");
    throw error;
  }
}

export async function translateMixedText(text: string, model: SupportedModel): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "Translate the following Chinese-English mixed text to proper English.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return response.choices[0]?.message?.content || text;
  } catch (error) {
    handleError(error, "translate text");
    throw error;
  }
} 