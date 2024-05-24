export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge';

export async function POST(request: Request) {
    if (request.headers.get("Content-Type") === "application/json") {
        const { text } = await request.json();

        // Splitting text into sentences
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

        // Process each sentence with a single OpenAI call
        // const results = await Promise.all(sentences.map(async (sentence) => {
        //     const explanation = await askOpenAI(sentence);
        //     const words = sentence.split(/\s+/).map(word => ({ word }));
        //     return { sentence, explanation, words };
        // }));

        return new Response(JSON.stringify(text), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        return new Response("Please send JSON format", { status: 400 });
    }

//   return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}