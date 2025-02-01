import { TemplateLoaderInterface } from '@m2broth/promptmesh/interfaces/template-loader.interface';
import { PromptTemplateProcessor } from '@m2broth/promptmesh/services/prompt-template-processor';
import { PromptTemplateList } from '@m2broth/promptmesh/models/prompt-template-list';
import { PromptTemplateNode } from '@m2broth/promptmesh/models/prompt-template-node';

export interface ProcessPromptTemplateOptions {
  prompts: PromptTemplateNode[];
  commonParams?: Record<string, any>;
}

export class AskCompletionService {
  constructor(
    private templateLoader: TemplateLoaderInterface,
    private promptTemplateProcessor: PromptTemplateProcessor,
  ) {}

  async askCompletion(
    options: ProcessPromptTemplateOptions,
  ): Promise<PromptTemplateNode> {
    // Load templates for prompts
    for (const prompt of options.prompts) {
      await this.templateLoader.loadTemplate(prompt);
    }

    return await this.promptTemplateProcessor.processPrompts(
      new PromptTemplateList(options.prompts, options.commonParams),
    );
  }
}
