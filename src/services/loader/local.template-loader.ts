import { TemplateLoaderInterface } from '@m2broth/promptmesh/services/interfaces/template-loader.interface';
import { PromptTemplateNode } from '@m2broth/promptmesh/models/prompt-template-node';

export type LocalTemplate = Record<string, string>;

/**
 * LocalTemplateLoader loads templates from a local object.
 */

export class LocalTemplateLoader implements TemplateLoaderInterface {
  private _localTemplates: LocalTemplate = {};

  async loadTemplate(promptTemplate: PromptTemplateNode): Promise<void> {
    promptTemplate.template = this._localTemplates[promptTemplate.name];
  }

  get localTemplates(): LocalTemplate {
    return this._localTemplates;
  }

  set localTemplates(templates: LocalTemplate) {
    this._localTemplates = templates;
  }
}
