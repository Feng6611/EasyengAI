import OpenAI from "openai";
import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  apiKey: string;
}

const openai = new OpenAI({
  apiKey: getPreferenceValues<Preferences>().apiKey,
});

export async function polishText(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
    console.error("Error polishing text:", error);
    throw error;
  }
}

export async function translateMixedText(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
    console.error("Error translating text:", error);
    throw error;
  }
} 