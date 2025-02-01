import { ResultService } from '@m2broth/promptmesh/services/result.service';
import { CompletionProviderInterface } from '@m2broth/promptmesh/interfaces/completion-provider.interface';

describe('ResultService', () => {
  let resultService: ResultService;
  let mockCompletionProvider: jest.Mocked<CompletionProviderInterface>;

  beforeEach(() => {
    mockCompletionProvider = {
      getCompletion: jest.fn(),
    };
    resultService = new ResultService(mockCompletionProvider);
  });

  describe('callback', () => {
    it('should forward the question to completion provider', async () => {
      const question = 'test question';
      const expectedResponse = 'test response';
      mockCompletionProvider.getCompletion.mockResolvedValueOnce(expectedResponse);

      const result = await resultService.callback(question);

      expect(result).toBe(expectedResponse);
      expect(mockCompletionProvider.getCompletion).toHaveBeenCalledWith(question);
      expect(mockCompletionProvider.getCompletion).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from completion provider', async () => {
      const question = 'test question';
      const error = new Error('Test error');
      mockCompletionProvider.getCompletion.mockRejectedValueOnce(error);

      await expect(resultService.callback(question)).rejects.toThrow('Test error');
      expect(mockCompletionProvider.getCompletion).toHaveBeenCalledWith(question);
    });
  });
});
