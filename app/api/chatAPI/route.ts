import { ChatBody } from '@/types/types';
import { createParser } from 'eventsource-parser';

// A Barewire-aware OpenAIStream function to enable agentic proxy capabilities.
// This function replaces the original utility to allow direct configuration of the LLM endpoint
// and seamless integration with Barewire's agentic observability and control features.
export async function OpenAIStream(inputCode: string, model: string, apiKey: string) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const barewireApiBase = process.env.NEXT_PUBLIC_BAREWIRE_API_BASE;
  const barewireApiKey = process.env.NEXT_PUBLIC_BAREWIRE_API_KEY; // Barewire specific API Key
  const openaiApiBase = 'https://api.openai.com'; // Default OpenAI base URL

  const useBarewire = barewireApiBase && barewireApiKey;

  const url = useBarewire
    ? `${barewireApiBase}/v1/chat/completions`
    : `${openaiApiBase}/v1/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`, // Original OpenAI API key, passed to Barewire or directly to OpenAI
  };

  if (useBarewire) {
    headers['X-Barewire-Key'] = barewireApiKey as string;
    // Barewire typically uses the original LLM API key in Authorization, and its own key in X-Barewire-Key.
  }

  // The `inputCode` from ChatBody is a string, assuming it's the user's prompt.
  // This formats it into the OpenAI chat completions `messages` array.
  const payload = {
    model: model,
    messages: [{ role: 'user', content: inputCode }],
    stream: true,
  };

  const res = await fetch(url, {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.error(`LLM API response error: ${res.status} ${res.statusText}, Body: ${errorData}`);
    throw new Error(`Failed to get response from LLM API: ${res.statusText || res.status}. Body: ${errorData}`);
  }

  const stream = new ReadableStream({
    async start(controller) {
      const parser = createParser((event) => {
        if (event.type === 'event') {
          if (event.data === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(event.data);
            const text = json.choices[0].delta?.content || '';
            if (text.length > 0) {
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            }
          } catch (e) {
            console.error('Error parsing stream event:', e);
            controller.error(e);
          }
        }
      });

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}

export const runtime = 'edge';

export async function GET(req: Request): Promise<Response> {
  try {
    const { inputCode, model, apiKey } = (await req.json()) as ChatBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(inputCode, model, apiKeyFinal);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { inputCode, model, apiKey } = (await req.json()) as ChatBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(inputCode, model, apiKeyFinal);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
