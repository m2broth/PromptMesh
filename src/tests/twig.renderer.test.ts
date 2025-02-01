import nunjucks from 'nunjucks';
import { TwigRenderer } from "@m2broth/promptmesh/services/twig.renderer";
import { PromptTemplateNode } from "@m2broth/promptmesh/models/prompt-template-node";

describe("TwigRenderer", () => {
  let twigRenderer: TwigRenderer;

  beforeEach(() => {
    twigRenderer = new TwigRenderer();
  });

  describe("callback", () => {
    it("should render template with provided params", async () => {
      const promptTemplateNode: PromptTemplateNode = {
        name: "test-template",
        template: "Hello {{ name }}",
        params: { name: "World" },
        resultParams: {},
      };

      const result = await twigRenderer.callback(promptTemplateNode);

      expect(result).toBe("Hello World");
    });

    it("should render template with result params", async () => {
      const promptTemplateNode: PromptTemplateNode = {
        name: "test-template",
        template: "Hello {{ name }}",
        params: {},
        resultParams: { name: "Copilot" },
      };

      const result = await twigRenderer.callback(promptTemplateNode);

      expect(result).toBe("Hello Copilot");
    });

    it("should render template with both params and result params", async () => {
      const promptTemplateNode: PromptTemplateNode = {
        name: "test-template",
        template: "Hello {{ name }} from {{ place }}",
        params: { name: "World" },
        resultParams: { place: "GitHub" },
      };

      const result = await twigRenderer.callback(promptTemplateNode);

      expect(result).toBe("Hello World from GitHub");
    });
  });

  describe("getEnvironment", () => {
    it("should return the nunjucks environment", () => {
      const env = twigRenderer.getEnvironment();
      expect(env).toBeInstanceOf(nunjucks.Environment);
    });
  });
});
