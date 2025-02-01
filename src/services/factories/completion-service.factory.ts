import { AskCompletionService } from '@m2broth/promptmesh/services/ask-completion.service';
import { ChatGPTCompletionProvider } from '@m2broth/promptmesh/services/chatgpt-completion.provider';
import { PromptTemplateProcessor } from '@m2broth/promptmesh/services/prompt-template-processor';
import { ResultService } from '@m2broth/promptmesh/services/result.service';
import { TwigRenderer } from '@m2broth/promptmesh/services/twig.renderer';
import { LocalTemplateLoader } from '@m2broth/promptmesh/services/loader/local.template-loader';
import nunjucks from 'nunjucks';

export interface CompletionServiceConfig {
  OPENAI_API_KEY: string;
  GPT_MODEL: string;
  nunjucksConfig?: nunjucks.ConfigureOptions;
}

export class CompletionServiceFactory {
  static create(config: CompletionServiceConfig): AskCompletionService {
    // Create completion provider
    const completionProvider = new ChatGPTCompletionProvider({
      OPENAI_API_KEY: config.OPENAI_API_KEY,
      GPT_MODEL: config.GPT_MODEL,
    });

    // Create template renderer with Twig
    const twigRenderer = new TwigRenderer(config.nunjucksConfig);

    // Create result service
    const resultService = new ResultService(completionProvider);

    // Create template processor
    const promptTemplateProcessor = new PromptTemplateProcessor(
      twigRenderer,
      resultService,
    );

    // Create template loader
    const templateLoader = new LocalTemplateLoader();

    // Create and return the completion service
    return new AskCompletionService(templateLoader, promptTemplateProcessor);
  }
}
