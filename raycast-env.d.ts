/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Default AI Model - Choose the default AI model to use */
  "aiModel": "openai-gpt-4o" | "openai-gpt-4o-mini" | "anthropic-claude-sonnet" | "anthropic-claude-haiku" | "llama3.1-8b" | "llama3.1-70b" | "gemini-1.5-flash",
  /** OpenRouter API Key - Your OpenRouter API key for accessing Gemini models */
  "openrouterApiKey"?: string,
  /** Writing Style - Choose the default writing style */
  "style": "professional" | "casual" | "academic" | "creative"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {}
  /** Preferences accessible in the `test` command */
  export type Test = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `index` command */
  export type Index = {}
  /** Arguments passed to the `test` command */
  export type Test = {}
}

