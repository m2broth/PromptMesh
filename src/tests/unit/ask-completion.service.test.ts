import { AskCompletionService } from "@m2broth/promptmesh/services/ask-completion.service";
import { TemplateLoaderInterface } from "@m2broth/promptmesh/interfaces/template-loader.interface";
import { PromptTemplateProcessor } from "@m2broth/promptmesh/services/prompt-template-processor";
import { PromptTemplateNode } from "@m2broth/promptmesh/models/prompt-template-node";
import { PromptTemplateList } from "@m2broth/promptmesh/models/prompt-template-list";

describe("AskCompletionService", () => {
  let askCompletionService: AskCompletionService;
  let mockTemplateLoader: jest.Mocked<TemplateLoaderInterface>;
  let mockPromptTemplateProcessor: jest.Mocked<PromptTemplateProcessor>;

  beforeEach(() => {
    mockTemplateLoader = {
      loadTemplate: jest.fn(),
    } as jest.Mocked<TemplateLoaderInterface>;

    mockPromptTemplateProcessor = {
      processPrompts: jest.fn(),
      promptTemplateCallback: jest.fn(),
      resultCallback: jest.fn(),
      processNode: jest.fn(),
      processFinalNode: jest.fn(),
    } as unknown as jest.Mocked<PromptTemplateProcessor>;

    askCompletionService = new AskCompletionService(
      mockTemplateLoader,
      mockPromptTemplateProcessor,
    );
  });

  describe("askCompletion", () => {
    it("should load templates for prompts and process them", async () => {
      const prompts: PromptTemplateNode[] = [
        {
          name: "test-template-1",
          template: "Hello {{ name }}",
          params: { name: "World" },
          resultParams: {},
        },
        {
          name: "test-template-2",
          template: "Goodbye {{ name }}",
          params: { name: "World" },
          resultParams: {},
        },
      ];
      const options = { prompts };
      const processedPromptTemplateNode: PromptTemplateNode = {
        name: "processed-template",
        template: "Processed",
        params: {},
        resultParams: {},
      };

      mockPromptTemplateProcessor.processPrompts.mockResolvedValueOnce(
        processedPromptTemplateNode,
      );

      const result = await askCompletionService.askCompletion(options);

      expect(mockTemplateLoader.loadTemplate).toHaveBeenCalledTimes(
        prompts.length,
      );
      prompts.forEach((prompt) => {
        expect(mockTemplateLoader.loadTemplate).toHaveBeenCalledWith(prompt);
      });
      expect(mockPromptTemplateProcessor.processPrompts).toHaveBeenCalledWith(
        new PromptTemplateList(prompts, undefined),
      );
      expect(result).toBe(processedPromptTemplateNode);
    });

    it("should handle commonParams if provided", async () => {
      const prompts: PromptTemplateNode[] = [
        {
          name: "test-template-1",
          template: "Hello {{ name }}",
          params: { name: "World" },
          resultParams: {},
        },
      ];
      const commonParams = { commonParams: { commonKey: "commonValue" } };
      const options = { prompts, commonParams };
      const processedPromptTemplateNode: PromptTemplateNode = {
        name: "processed-template",
        template: "Processed",
        params: {},
        resultParams: {},
      };

      mockPromptTemplateProcessor.processPrompts.mockResolvedValueOnce(
        processedPromptTemplateNode,
      );

      const result = await askCompletionService.askCompletion(options);

      expect(mockTemplateLoader.loadTemplate).toHaveBeenCalledTimes(
        prompts.length,
      );
      prompts.forEach((prompt) => {
        expect(mockTemplateLoader.loadTemplate).toHaveBeenCalledWith(prompt);
      });
      expect(mockPromptTemplateProcessor.processPrompts).toHaveBeenCalledWith(
        new PromptTemplateList(prompts, commonParams),
      );
      expect(result).toBe(processedPromptTemplateNode);
    });
  });
});
