import OpenAI from "openai";
import { CompletionProviderInterface } from "@m2broth/promptmesh/interfaces/completion-provider.interface";

export class ChatGPTCompletionProvider implements CompletionProviderInterface {
  private openai: OpenAI;

  constructor(private params: { OPENAI_API_KEY: string; GPT_MODEL: string }) {
    this.openai = new OpenAI({
      apiKey: this.params.OPENAI_API_KEY,
    });
  }

  async getCompletion(prompt: string): Promise<string> {
    const chatCompletion = await this.openai.chat.completions.create({
      model: this.params.GPT_MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No completion content received from OpenAI");
    }
    return content;
  }
}
