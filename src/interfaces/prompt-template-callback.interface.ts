import { PromptTemplateNode } from '@m2broth/promptmesh/models/prompt-template-node';

export interface PromptTemplateCallback {
  callback(promptTemplate: PromptTemplateNode): Promise<string>;
}
