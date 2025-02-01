import { PromptTemplateNode } from '@m2broth/promptmesh/models/prompt-template-node';

interface PromptTemplateListOptions {
  commonParams?: Record<string, unknown>;
  initialCapacity?: number;
}

export class PromptTemplateList implements Iterable<PromptTemplateNode> {
  private readonly nodes: PromptTemplateNode[] = [];
  private readonly commonParams: Record<string, unknown>;

  constructor(
    prompts: ReadonlyArray<PromptTemplateNode> = [],
    options: PromptTemplateListOptions = {}
  ) {
    this.commonParams = Object.freeze({ ...options.commonParams });
    this.addPromptTemplates(prompts);
  }

  /**
   * Adds multiple prompt templates to the list
   * @param prompts Array of prompt templates to add
   * @returns The number of templates added
   */
  public addPromptTemplates(prompts: ReadonlyArray<PromptTemplateNode>): number {
    if (!prompts.length) return 0;

    prompts.forEach(prompt => this.addPromptTemplate(prompt));
    return prompts.length;
  }

  /**
   * Adds a single prompt template to the list
   * @param promptTemplate Template to add
   * @returns The added template with updated links
   * @throws Error if promptTemplate is null or undefined
   */
  public addPromptTemplate(promptTemplate: PromptTemplateNode): PromptTemplateNode {
    if (!promptTemplate) {
      throw new Error('Prompt template cannot be null or undefined');
    }

    const newPrompt = {
      ...promptTemplate,
      params: {
        ...promptTemplate.params,
        ...this.commonParams,
      }
    };

    if (this.nodes.length > 0) {
      const lastNode = this.nodes[this.nodes.length - 1];
      lastNode.next = newPrompt;
      newPrompt.prev = lastNode;
    }

    this.nodes.push(newPrompt);
    return newPrompt;
  }

  /**
   * Gets the first prompt template in the list
   * @returns The first prompt template or undefined if list is empty
   */
  public get initial(): PromptTemplateNode | undefined {
    return this.nodes[0];
  }

  /**
   * Gets the total number of templates in the list
   */
  public get size(): number {
    return this.nodes.length;
  }

  /**
   * Checks if the list is empty
   */
  public get isEmpty(): boolean {
    return this.nodes.length === 0;
  }

  /**
   * Creates a shallow copy of the template list
   */
  public clone(): PromptTemplateList {
    return new PromptTemplateList([...this.nodes], { commonParams: this.commonParams });
  }

  /**
   * Implements the Iterator protocol for the template list
   */
  public *[Symbol.iterator](): Iterator<PromptTemplateNode> {
    yield* this.nodes;
  }

  /**
   * Converts the template list to an array
   */
  public toArray(): ReadonlyArray<PromptTemplateNode> {
    return [...this.nodes];
  }
}
