import { ResultCallback } from '@m2broth/promptmesh/services/interfaces/result-callback.interface';
import { CompletionProviderInterface } from '@m2broth/promptmesh/interfaces/completion-provider.interface';

export class ResultService implements ResultCallback {
  constructor(private completionProvider: CompletionProviderInterface) {}

  async callback(question: string): Promise<string> {
    return this.completionProvider.getCompletion(question);
  }
}
