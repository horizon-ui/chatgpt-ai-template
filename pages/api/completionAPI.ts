// pages/api/openai.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';

export const config = {
  runtime: 'edge',
};

async function callOpenAI(inputCode: string, model: string, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: inputCode,
      max_tokens: 150,
      model: model,
    }),
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}

async function openAIHandler(reqBody: any): Promise<{ statusCode: StatusCodes; message: string }> {
  try {
    const { inputCode, model, apiKey: requestApiKey } = reqBody;

    const apiKey = requestApiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
      return { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'API key not found' };
    }

    const responseFromOpenAI = await callOpenAI(inputCode, model, apiKey);

    return { statusCode: StatusCodes.OK, message: responseFromOpenAI };
  } catch (error) {
    console.error(error);
    return { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Error' };
  } 
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.statusCode = StatusCodes.METHOD_NOT_ALLOWED;
        res.end('Method not allowed');
        return;
    }
    

  const response = await openAIHandler(req.body);
  res.status(response.statusCode).send(response.message);
};
