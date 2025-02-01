import "dotenv/config";

import { ChatGPTCompletionProvider } from "@m2broth/promptmesh/services/chatgpt-completion.provider";
import { PromptTemplateProcessor } from "@m2broth/promptmesh/services/prompt-template-processor";
import { ResultService } from "@m2broth/promptmesh/services/result.service";
import { TwigRenderer } from "@m2broth/promptmesh/services/twig.renderer";
import { AskCompletionService } from "@m2broth/promptmesh/services/ask-completion.service";
import { LocalTemplateLoaderFactory } from "@m2broth/promptmesh/services/loader/local-template-loader.factory";
import { knex } from "knex";

describe("completion should work", () => {
  it("should use real chatgpt for completion", async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.GPT_MODEL;

    const provider = new ChatGPTCompletionProvider({
      OPENAI_API_KEY: apiKey,
      GPT_MODEL: model,
    });

    const twigRenderer = new TwigRenderer();
    const resultService = new ResultService(provider);
    const promptTemplateProcessor = new PromptTemplateProcessor(
      twigRenderer,
      resultService,
    );
    const env = twigRenderer.getEnvironment();
    const dbConnection = knex({
      client: "pg", // or 'mysql', 'sqlite3', etc.
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
    });
    const askCompletionService = new AskCompletionService(
      await LocalTemplateLoaderFactory.initTemplateLoader(
        {
          promptTemplateTableName: "prompt_template",
          promptTemplateShorthandTableName: "prompt_template_shorthand",
        },
        env,
        dbConnection,
      ),
      promptTemplateProcessor,
    );

    const result = await askCompletionService.askCompletion({
      prompts: [
        {
          name: "ask",
          params: {
            text: "Get list of countries and their capitals",
          },
        },
      ],
    });

    expect(result.name).toBe("ask");
  });

  it("should process complex multi-prompt completion scenario", async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.GPT_MODEL;

    const provider = new ChatGPTCompletionProvider({
      OPENAI_API_KEY: apiKey,
      GPT_MODEL: model,
    });

    const twigRenderer = new TwigRenderer();
    const resultService = new ResultService(provider);
    const promptTemplateProcessor = new PromptTemplateProcessor(
      twigRenderer,
      resultService,
    );
    const env = twigRenderer.getEnvironment();
    const dbConnection = knex({
      client: "pg",
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
    });
    const askCompletionService = new AskCompletionService(
      await LocalTemplateLoaderFactory.initTemplateLoader(
        {
          promptTemplateTableName: "prompt_template",
          promptTemplateShorthandTableName: "prompt_template_shorthand",
        },
        env,
        dbConnection,
      ),
      promptTemplateProcessor,
    );

    const result = await askCompletionService.askCompletion({
      prompts: [
        {
          name: "initial",
          params: {
            role: "senior software architect",
            delimited: "You will help design a scalable e-commerce system",
            delimiter: "---",
          },
        },
        {
          name: "actas",
          params: {
            role: "system architect",
            criteria: "scalability, security, and performance",
            request:
              "design a high-level architecture for an e-commerce platform",
          },
        },
        {
          name: "chainofthought",
          params: {
            steps: [
              "Analyze requirements",
              "Design components",
              "Consider trade-offs",
            ],
            delimited: "Break down the e-commerce system design process",
            delimiter: "###",
            chains: [
              "Identify core business requirements and constraints",
              "Design microservices architecture and data models",
              "Evaluate technology stack and deployment strategies",
            ],
          },
        },
        {
          name: "classification",
          params: {
            categoryTree: {
              "Architecture Components": [
                "Frontend",
                "Backend",
                "Database",
                "Infrastructure",
              ],
              "Security Measures": [
                "Authentication",
                "Authorization",
                "Data Encryption",
              ],
              "Performance Optimizations": ["Caching", "Load Balancing", "CDN"],
            },
          },
        },
        {
          name: "steps",
          params: {
            errorMessage: "Implementation steps are required",
          },
        },
      ],
    });

    expect(result.result).toBeDefined();
  });
});
