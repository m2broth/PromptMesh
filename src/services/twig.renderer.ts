import * as nunjucks from 'nunjucks';
import { PromptTemplateCallback } from '@m2broth/promptmesh/interfaces/prompt-template-callback.interface';
import { PromptTemplateNode } from '@m2broth/promptmesh/models/prompt-template-node';

export class TwigRenderer implements PromptTemplateCallback {
  private env: nunjucks.Environment;

  constructor(config: nunjucks.ConfigureOptions = {}) {
    this.env = new nunjucks.Environment(null, config);
  }

  async callback(promptTemplateNode: PromptTemplateNode): Promise<string> {
    return this.env.renderString(promptTemplateNode.template, {
      ...promptTemplateNode.params,
      ...promptTemplateNode.resultParams,
    });
  }

  getEnvironment(): nunjucks.Environment {
    return this.env;
  }
}
