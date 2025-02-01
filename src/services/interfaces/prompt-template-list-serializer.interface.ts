import { PromptTemplateList } from '@m2broth/promptmesh/models/prompt-template-list';

export interface PromptTemplateListSerializerInterface<T> {
  serialize: (promptTemplateList: PromptTemplateList) => Promise<T>;

  deserialize: (data: T) => Promise<PromptTemplateList>;
}
