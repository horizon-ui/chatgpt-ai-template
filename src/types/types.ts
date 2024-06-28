export type OpenAIModel = 'gpt-4o' | 'gpt-3.5-turbo';

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}
