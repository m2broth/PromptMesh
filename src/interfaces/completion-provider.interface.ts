export interface CompletionProviderInterface {
  getCompletion(prompt: string): Promise<string>;
}
