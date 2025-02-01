import { CompletionServiceFactory } from "../../../services/factories/completion-service.factory";

describe("CompletionServiceFactory", () => {
  describe("create", () => {
    it("should create a working completion service with real dependencies", async () => {
      const service = CompletionServiceFactory.create({
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        GPT_MODEL: "gpt-3.5-turbo",
      });

      expect(service).toBeDefined();
    });
  });
});
