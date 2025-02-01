export type PromptTemplateNode = {
  name: string;
  template?: string;
  params?: Record<string, any>;
  resultParams?: Record<string, any>;
  next?: PromptTemplateNode;
  prev?: PromptTemplateNode;
  isProcessResult?: boolean; // send a list of prompts before this node as a prompt and get answer
} & ResultNode;

export type ResultNode = {
  result?: string;
};
