import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

// Helper function to generate a random seed
const generateSeed = () => Math.floor(Math.random() * 100000);

// Helper function to resize images
const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions while maintaining aspect ratio
            if (width > maxWidth || height > maxHeight) {
                const aspectRatio = width / height;
                if (width > maxWidth) {
                    width = maxWidth;
                    height = width / aspectRatio;
                }
                if (height > maxHeight) {
                  height = maxHeight;
                  width = height * aspectRatio;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              canvas.toBlob((blob) => {
                  if (blob) {
                      const resizedFile = new File([blob], file.name, { type: file.type });
                      resolve(resizedFile);
                  } else {
                      reject(new Error('Failed to create blob from canvas.'));
                  }
                }, file.type);
            } else {
              reject(new Error('Canvas context is null.'));
            }

        };
        img.onerror = () => {
            reject(new Error('Error loading image.'));
        };
    });
};


// Function to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = reader.result?.toString().split(',')[1];
            if (base64String) {
                resolve(base64String);
            } else {
                reject(new Error('Failed to convert file to base64.'));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};


const createPrompt = (inputCode: string) => {
    const data = (inputCode: string) => {
        return endent`${inputCode}`;
    };

    if (inputCode) {
        return data(inputCode);
    }
};


// Function to process text using Pollinations API
export const PollinationsTextStream = async (
    inputCode: string,
    model: string = 'mistral',
    systemPrompt: string | undefined = undefined, //Allow a system prompt
    jsonMode: boolean = false,
) => {
    const prompt = createPrompt(inputCode);
    const seed = generateSeed();
    const url = `https://text.pollinations.ai/`;

    const requestBody = {
        messages: [
            { role: 'user', content: prompt }
        ],
        model: model,
        seed: seed,
        jsonMode: jsonMode,
    };

        if (systemPrompt) {
            requestBody.messages.unshift({role:"system", content:systemPrompt})
    }


    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)

    });


    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    if (res.status !== 200) {
        const statusText = res.statusText;
        const result = await res.body?.getReader().read();
        throw new Error(
            `Pollinations API returned an error: ${
                decoder.decode(result?.value) || statusText
            }`,
        );
    }


    const stream = new ReadableStream({
        async start(controller) {
            const onParse = (event: ParsedEvent | ReconnectInterval) => {
                if (event.type === 'event') {
                    const data = event.data;

                    if (data === '[DONE]') {
                        controller.close();
                        return;
                    }

                    try {
                        let text = data;
                        if (jsonMode) {
                           const json = JSON.parse(data);
                           text = json.content;
                        }
                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                    } catch (e) {
                         controller.error(e);
                     }
                }
            };


            //handle non stream response
            if (!res.body) {
                const result = await res.text();
                try {
                   let text = result;
                   if (jsonMode) {
                       const json = JSON.parse(result);
                         text = json.content;
                    }

                     const queue = encoder.encode(text);
                     controller.enqueue(queue);
                } catch (e) {
                     controller.error(e)
                 }
                 controller.close();
                 return;
            }

             const parser = createParser(onParse);
             for await (const chunk of res.body as any) {
                parser.feed(decoder.decode(chunk));
             }

         }
    });


    return stream;
};

// Function to process images using Pollinations API (for image analysis)
export const PollinationsImageAnalysis = async (
  imageFile: File,
    prompt:string,
    model: string = 'openai',
    maxWidth: number = 768,
    maxHeight: number = 768
) => {

    try {
      const resizedImage = await resizeImage(imageFile, maxWidth, maxHeight);
        const base64Image = await fileToBase64(resizedImage);
         const requestBody = {
             messages: [
                {
                    role: 'user',
                    content: [
                       { type: 'text', text: prompt },
                       { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
                     ],
                 },
            ],
        model:model,
        jsonMode:false,
      };

        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });


        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

       const result = await response.text();
       return result;
    } catch (error) {
      console.error('Error in PollinationsImageAnalysis:', error);
      throw error;
    }
};

// Function to process video by extracting frames
export const PollinationsVideoAnalysis = async (
    videoFile: File,
    prompt: string,
    model: string = 'openai',
    frameInterval: number = 1, // Time gap between frames in seconds
    maxWidth: number = 768,
    maxHeight: number = 768
) => {
    return new Promise(async (resolve, reject) => {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(videoFile);
        video.preload = 'metadata';

        video.onloadedmetadata = async () => {
            try {
               const canvas = document.createElement('canvas');
               const ctx = canvas.getContext('2d');
               if (!ctx) {
                   reject('Canvas context is null');
                   return;
               }
                 const duration = video.duration;
                 const frames:string[] = [];
                for (let time = 0; time < duration; time += frameInterval) {
                    video.currentTime = time;
                    await new Promise((r) => setTimeout(r, 100)); // Wait for frame

                     canvas.width = video.videoWidth;
                     canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageUrl = canvas.toDataURL('image/jpeg');
                    const base64Image = imageUrl.split(',')[1];
                    frames.push(base64Image);
                }


                // Send all frames to the API
                const requestBody = {
                    messages: [
                         {
                            role: 'user',
                            content: [
                                { type: 'text', text: prompt },
                                ...frames.map(frame => ({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${frame}` } })),
                            ],
                        },
                    ],
                    model: model,
                    jsonMode:false,
                };


               const response = await fetch('https://text.pollinations.ai/', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(requestBody)
               });

                 if (!response.ok) {
                    const errorText = await response.text();
                    reject(new Error(`API Error: ${response.status} - ${errorText}`));
                    return;
                }

               const result = await response.text();
               resolve(result);


            } catch (error) {
                 console.error('Error in PollinationsVideoAnalysis:', error);
                 reject(error);
             }
        };

      video.onerror = () => {
          reject('Error loading video')
      }

    });
};
