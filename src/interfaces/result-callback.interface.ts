export interface ResultCallback {
  callback(message: string): Promise<string>;
}
