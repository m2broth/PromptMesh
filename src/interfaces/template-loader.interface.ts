import { PromptTemplateNode } from '@m2broth/promptmesh/models/prompt-template-node';

export interface TemplateLoaderInterface {
  loadTemplate(promptTemplate: PromptTemplateNode): Promise<void>;
}
