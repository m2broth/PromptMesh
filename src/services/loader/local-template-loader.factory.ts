import * as nunjucks from 'nunjucks';
import { Knex } from 'knex';
import { LocalTemplateLoader } from '@m2broth/promptmesh/services/loader/local.template-loader';
import { PromptTemplateShorthandNode } from '@m2broth/promptmesh/models/prompt-template-shorthand-node';

interface DbConfig {
  promptTemplateTableName: string;
  promptTemplateShorthandTableName: string;
}

export class LocalTemplateLoaderFactory {
  static async initTemplateLoader(
    config: DbConfig,
    env: nunjucks.Environment,
    dbConnection: Knex,
  ): Promise<LocalTemplateLoader> {
    const loader = new LocalTemplateLoader();
    //init global prompt template shorthands
    const templateShorthands: PromptTemplateShorthandNode[] = await dbConnection
      .select()
      .from(config.promptTemplateShorthandTableName);

    templateShorthands.forEach((shorthand) => {
      env.addGlobal(shorthand.shorthand_name, shorthand.shorthand_text);
    });

    // init prompt templates list (as a cache first)
    const prompts = await dbConnection
      .select()
      .from(config.promptTemplateTableName);

    for (const prompt of prompts) {
      loader.localTemplates[prompt.prompt_template_name] = prompt.template;
    }

    return loader;
  }
}
