import { LocalTemplateLoader } from '@m2broth/promptmesh/services/loader/local.template-loader';
import { PromptTemplateNode } from '@m2broth/promptmesh/models/prompt-template-node';

describe('LocalTemplateLoader', () => {
  let loader: LocalTemplateLoader;

  beforeEach(() => {
    loader = new LocalTemplateLoader();
  });

  describe('loadTemplate', () => {
    it('should load template from local templates', async () => {
      const templates = {
        'test-template': 'Hello {{ name }}',
      };
      loader.localTemplates = templates;

      const promptTemplate: PromptTemplateNode = {
        name: 'test-template',
      };

      await loader.loadTemplate(promptTemplate);

      expect(promptTemplate.template).toBe('Hello {{ name }}');
    });

    it('should set undefined when template not found', async () => {
      const templates = {
        'existing-template': 'Some content',
      };
      loader.localTemplates = templates;

      const promptTemplate: PromptTemplateNode = {
        name: 'non-existing-template',
      };

      await loader.loadTemplate(promptTemplate);

      expect(promptTemplate.template).toBeUndefined();
    });
  });

  describe('localTemplates getter/setter', () => {
    it('should get empty object by default', () => {
      expect(loader.localTemplates).toEqual({});
    });

    it('should set and get templates', () => {
      const templates = {
        template1: 'Content 1',
        template2: 'Content 2',
      };

      loader.localTemplates = templates;

      expect(loader.localTemplates).toEqual(templates);
    });

    it('should override existing templates', () => {
      const templates1 = { template1: 'Content 1' };
      const templates2 = { template2: 'Content 2' };

      loader.localTemplates = templates1;
      loader.localTemplates = templates2;

      expect(loader.localTemplates).toEqual(templates2);
      expect(loader.localTemplates).not.toEqual(templates1);
    });
  });
});
