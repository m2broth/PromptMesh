import { ChatGPTCompletionProvider } from "@m2broth/promptmesh/services/chatgpt-completion.provider";

const mockCreate = jest.fn();

// Mock OpenAI
jest.mock("openai", () => {
  return class MockOpenAI {
    chat = {
      completions: {
        create: mockCreate,
      },
    };
  };
});

describe("ChatGPTCompletionProvider", () => {
  let provider: ChatGPTCompletionProvider;

  const testParams = {
    OPENAI_API_KEY: "test-api-key",
    GPT_MODEL: "gpt-4",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new ChatGPTCompletionProvider(testParams);
  });

  describe("getCompletion", () => {
    it("should return completion content when API call is successful", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: "Test completion response",
            },
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      const prompt = "Test prompt";
      const result = await provider.getCompletion(prompt);

      expect(result).toBe("Test completion response");
      expect(mockCreate).toHaveBeenCalledWith({
        model: testParams.GPT_MODEL,
        messages: [{ role: "user", content: prompt }],
      });
    });

    it("should throw error when no completion content is received", async () => {
      const mockResponse = {
        choices: [{ message: { content: null } }],
      };

      mockCreate.mockResolvedValue(mockResponse);

      const prompt = "Test prompt";
      await expect(provider.getCompletion(prompt)).rejects.toThrow(
        "No completion content received from OpenAI",
      );
    });

    it("should throw error when API call fails", async () => {
      const errorMessage = "API Error";
      mockCreate.mockRejectedValue(new Error(errorMessage));

      const prompt = "Test prompt";
      await expect(provider.getCompletion(prompt)).rejects.toThrow(
        errorMessage,
      );
    });
  });
});
