export interface ResultCallback {
  callback: (question: string) => Promise<string>;
}
