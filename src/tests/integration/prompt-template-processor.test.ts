import { PromptTemplateList } from '@m2broth/promptmesh/models/prompt-template-list';
import { PromptTemplateNode } from '@m2broth/promptmesh/models/prompt-template-node';
import { ChatGPTCompletionProvider } from '@m2broth/promptmesh/services/chatgpt-completion.provider';
import { TwigRenderer } from '@m2broth/promptmesh/services/twig.renderer';
import { ResultService } from '@m2broth/promptmesh/services/result.service';
import { PromptTemplateProcessor } from '@m2broth/promptmesh/services/prompt-template-processor';

jest.mock('@m2broth/promptmesh/services/chatgpt-completion.provider', () => {
  return {
    ChatGPTCompletionProvider: jest.fn().mockImplementation(() => {
      return {
        getCompletion: jest.fn().mockResolvedValue('{"name": "World"}'),
      };
    }),
  };
});

describe('PromptTemplateProcessor', () => {
  it('should correctly process resultParams from previous prompt', async () => {
    const apiKey = 'test-api-key';
    const model = 'test-model';

    const provider = new ChatGPTCompletionProvider({
      OPENAI_API_KEY: apiKey,
      GPT_MODEL: model,
    });

    const twigRenderer = new TwigRenderer();
    const resultService = new ResultService(provider);
    const promptTemplateProcessor = new PromptTemplateProcessor(
      twigRenderer,
      resultService,
    );

    const resultNode: PromptTemplateNode =
      await promptTemplateProcessor.processPrompts(
        new PromptTemplateList([
          {
            name: 'initial',
            template: 'Hello {{ name }}',
            params: { name: 'World' },
            isProcessResult: false,
          },
          {
            name: 'next',
            template: 'Result: {{ result }}',
            params: {},
            isProcessResult: true,
            next: null,
          },
        ]),
      );

    expect(resultNode.result).toBe('{"name": "World"}');
    expect(resultNode.resultParams).toEqual({ name: 'World' });
  });
});
