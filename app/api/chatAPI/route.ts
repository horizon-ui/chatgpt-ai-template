// Use Node.js runtime to allow localhost calls during development.
export const runtime = "nodejs";

// Prefer explicit env var and fall back to the FastAPI route with /api/chat
const BACKEND_URL =
  process.env.DELFOS_BACKEND_URL?.trim() ||
  "http://127.0.0.1:8000/api/chat";

export async function POST(req: Request): Promise<Response> {
  try {
    const raw = await req.text();
    let inputCode: string | undefined;
    let userId: string | undefined;
    try {
      const body = JSON.parse(raw || "{}"); // lo que envía el front
      inputCode = body?.inputCode;
      userId = body?.userId;
    } catch (parseErr) {
      return new Response(
        `Error leyendo el body JSON: ${(parseErr as Error).message}. raw=${raw}`,
        { status: 400 },
      );
    }

    if (!inputCode) {
      return new Response("Falta inputCode en el body", { status: 400 });
    }

    // Lo que espera el backend FastAPI
    const payload = {
      message: inputCode,
      user_id: userId ?? "anonymous",
    };

    const backendRes = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // payload debe contener inputCode y userId
    });

    const text = await backendRes.text();
    console.log("Backend response:", text);

    if (!backendRes.ok) {
      console.error("Error backend Delfos:", text);
      return new Response(text, { status: backendRes.status });
    }

    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error llamando al backend Delfos:", error);
    const message =
      error instanceof Error
        ? `Error llamando al backend Delfos: ${error.message}`
        : "Error llamando al backend Delfos";
    return new Response(message, { status: 500 });
  }
}

export async function GET() {
  return new Response("Método no soportado", { status: 405 });
}
