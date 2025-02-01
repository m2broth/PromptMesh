import { PromptTemplateList } from "@m2broth/promptmesh/models/prompt-template-list";
import { PromptTemplateCallback } from "@m2broth/promptmesh/interfaces/prompt-template-callback.interface";
import { ResultCallback } from "@m2broth/promptmesh/interfaces/result-callback.interface";
import { PromptTemplateNode } from "@m2broth/promptmesh/models/prompt-template-node";

interface ProcessingState {
  message: string;
  isProcessResult: boolean;
}

export class PromptTemplateProcessor {
  constructor(
    private readonly promptTemplateCallback: PromptTemplateCallback,
    private readonly resultCallback: ResultCallback,
  ) {
    if (!promptTemplateCallback) {
      throw new Error('promptTemplateCallback is required');
    }
    if (!resultCallback) {
      throw new Error('resultCallback is required');
    }
  }

  /**
   * Process a list of prompt templates in sequence
   * @param prompts The list of prompts to process
   * @returns Promise with the last processed node
   * @throws Error if prompts list is empty or undefined
   */
  public async processPrompts(
    prompts: PromptTemplateList,
  ): Promise<PromptTemplateNode> {
    if (!prompts?.initial) {
      throw new Error('Prompts list cannot be empty or undefined');
    }

    let message = '';
    let currentNode = prompts.initial;

    try {
      while (currentNode) {
        const result = await this.processNode(currentNode, message);
        
        if (result.isProcessResult) {
          message = '';  // Reset message for next template
        } else {
          message += result.message;
        }

        if (!currentNode.next) {
          // Process final result if needed
          return this.processFinalNode(currentNode, message);
        }

        currentNode = currentNode.next;
      }

      throw new Error('Unexpected end of prompt chain');
    } catch (error) {
      // Re-throw the error to maintain original behavior
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  /**
   * Process a single prompt template node
   * @param node The node to process
   * @param currentMessage Accumulated message so far
   * @returns Processing state for the node
   */
  private async processNode(
    node: PromptTemplateNode,
    currentMessage: string,
  ): Promise<ProcessingState> {
    if (node.isProcessResult) {
      const result = await this.resultCallback.callback(currentMessage);
      node.result = result;

      try {
        const parsedResult = JSON.parse(result);
        if (parsedResult && typeof parsedResult === 'object') {
          node.resultParams = parsedResult;
        }
      } catch (e) {
        // Invalid JSON is acceptable - leave resultParams undefined
      }

      return { message: '', isProcessResult: true };
    }

    const message = await this.promptTemplateCallback.callback(node);
    return { message, isProcessResult: false };
  }

  /**
   * Process the final node in the chain
   * @param node The final node
   * @param message Accumulated message
   * @returns Final node with processed result
   */
  private async processFinalNode(
    node: PromptTemplateNode,
    message: string,
  ): Promise<PromptTemplateNode> {
    if (!node.result && message) {
      node.result = await this.resultCallback.callback(message);
      
      try {
        const parsedResult = JSON.parse(node.result);
        if (parsedResult && typeof parsedResult === 'object') {
          node.resultParams = parsedResult;
        }
      } catch (e) {
        // Invalid JSON is acceptable - leave resultParams undefined
      }
    }

    return node;
  }
}
