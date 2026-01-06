// src/utils/chatStream.ts (por ejemplo)

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/**
 * Ya no usamos OpenAI directo.
 * Esta función llama a tu backend FastAPI (/api/chat)
 * y devuelve un ReadableStream con la respuesta.
 */
export const OpenAIStream = async (
  inputCode: string,
  _model: string,                 // se mantienen por compatibilidad
  _key: string | undefined,       // pero ya no se usan
) => {
  // Llamada al backend Delfos
  const res = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: inputCode,
      user_id: "anonymous",
    }),
  });

  const encoder = new TextEncoder();

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Backend Delfos /api/chat devolvió un error: ${errorText}`,
    );
  }

  // Asumimos que el backend devuelve algo tipo:
  // { reply: "..."} o { answer: "..." }
  const data = await res.json();

  const reply: string =
    data.reply ??
    data.answer ??
    data.message ??
    JSON.stringify(data);

  // Creamos un stream sencillo que envía toda la respuesta de una vez
  const stream = new ReadableStream({
    start(controller) {
      const queue = encoder.encode(reply);
      controller.enqueue(queue);
      controller.close();
    },
  });

  return stream;
};