import { Character, DialogueToken } from '@/types/types';



/*
 * Send a request to the given resource and stream the results to the given callback.
 * Returns a promise that resolves when the full response has been streamed.
 *
 * Adapted from https://medium.com/@bs903944/event-streaming-made-easy-with-event-stream-and-javascript-fetch-8d07754a4bed
 */
export function streamResponse(
  resource: RequestInfo | URL,
  options:  RequestInit,
  callback: (value: string) => void
) {

  // Return as a Promise that resolves after the full response has been streamed
  return new Promise<void>((resolve, reject) => {

    // Fetch the given resource and start reading
    fetch(resource, options)
      .then(response => {

        // If response is empty, reject the promise
        if (!response.body) {
          reject();
          return;
        }

        // Initialize reader & decoder objects
        const reader = response.body.getReader()
        const decoder = new TextDecoder();

        // Recursive function that reads one chunk at a time and passes it to the callback
        // Resolves the Promise and stops the recursion when the stream ends
        const readChunk = () => {
          reader.read()
            .then(({ value, done }) => {

              // If a value was read, decode it to a string and pass each line to the callback
              // If multiple lines are generated and returned in quick succession, they may be chunked together
              if (value) {
                const chunkString = decoder.decode(value);
                for (let line of chunkString.split('\n')) {
                  if (line) callback(line);
                }
              }

              // If stream has finished, resolve the Promise and stop recursing
              if (done) {
                resolve();
                return;
              }

              // Recurse
              readChunk();
            })

            // On reader error, reject the Promise
            .catch((error) => {
              reject(error);
            })
        }

        // Read the first chunk
        readChunk();
      })

      // On fetch error, reject the Promise
      .catch((error) => {
        reject(error);
      })
  })
}


/*
 * Send a user message to the given resource and stream the AI response to the given callback.
 * Returns a promise that resolves when the full response has been streamed.
 *
 * TODO: Invoke callback with more specific Dialogue Token type
 */
export function streamAIMessage(
  resource: RequestInfo | URL,
  message:  string,
  options:  RequestInit,
  callback: (value: DialogueToken) => void
) {

  // Package user message into a POST request body
  const full_options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
    credentials: "include",

    // Combine any other options 
    ...options,
  };

  // Stream the response
  return streamResponse(resource, full_options, (value) => {
    if (value === null) return;

    // Parse the Dialogue Token and make sure the speaker is a valid Character object
    const token: DialogueToken = JSON.parse(value);
    token.speaker = Character(token.speaker);

    // Invoke the callback on the token
    callback(token);
  });
}



/* Exports */
export default {
  streamResponse,
  streamAIMessage,
}
