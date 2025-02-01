import { PromptTemplateNode } from '@m2broth/promptmesh/models/prompt-template-node';

export interface PromptTemplateFormatInterface {
  promptTemplateList: Array<PromptTemplateNode>;
  commonParams?: Record<string, string>;
}
