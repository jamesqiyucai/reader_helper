export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge';

import OpenAI from "openai";

const openai = new OpenAI();

const example_response = JSON.stringify([
    {
        "sentence": "Bienvenue à l'écoute des RFI en direct de Paris.",
        "explanation": [
            {
                "word": "Bienvenue,",
                "explanation": "This is a standard French word used for 'Welcome.' In this sentence, it serves as a greeting or invitation to the listeners. It's a noun and functions as the main welcoming phrase."
            },
            {
                "word": "à",
                "explanation": "Here, 'à' is a preposition that means 'to' or 'at,' linking 'Bienvenue' (Welcome) to 'l'écoute' (the listening). It indicates the direction or target of the welcome."
            },
            {
                "word": "l'écoute",
                "explanation": "This means 'the listening' in English. In the sentence, it is a noun that describes the act of listening. It serves as the object of the preposition 'à.'"
            },
            {
                "word": "des",
                "explanation": "'Des' is a contraction of 'de les,' which means 'of the' or 'from the' in English. It is a partitive article that specifies that the 'RFI' being referred to is not just any RFI but a specific one: the radio station RFI."
            },
            {
                "word": "RFI",
                "explanation": "This stands for 'Radio France Internationale,' a French public radio service. In the sentence, it is a proper noun serving as the subject being listened to."
            },
            {
                "word": "en",
                "explanation": "'En' is a preposition in French meaning 'in' or 'on.' In this context, it links 'RFI' to 'direct,' indicating that the listening experience is live."
            },
            {
                "word": "direct",
                "explanation": "This translates to 'live' in English. It is an adjective describing the nature of the listening experience as happening in real-time."
            },
            {
                "word": "de",
                "explanation": "'De' is a preposition that means 'from.' In this context, it indicates the origin of the live broadcast, linking 'direct' to 'Paris.'"
            },
            {
                "word": "Paris.",
                "explanation": "Paris is the capital city of France. In the sentence, it serves as a proper noun indicating the location from which the live broadcast is originating."
            }
        ]
    },
])

export async function POST(request: Request) {
    if (request.headers.get("Content-Type") === "application/json") {
        const { text } = await request.json();

        // Splitting text into sentences
        const sentences: [string] = text.match(/[^.!?]+[.!?]+/g) || [];

        // Process each sentence with a single OpenAI call
        const results = await Promise.all(sentences.map(async (sentence) => {
            return await askOpenAI(sentence);
            // const words = sentence.split(/\s+/).map(word => ({ word }));
            // return { sentence, explanation, words };
        }));

        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        return new Response("Please send JSON format", { status: 400 });
    }

//   return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}

async function askOpenAI(sentence: string) {
    const completion = openai.chat.completions.create({
        messages:[
            {
                role: "system",
                content: "You are an assistant who helps to explain each word in a given sentence, and output the explanations in JSON format."
            },
            {
                role: "user",
                content: "I am going to give you a sentence in French. Please explain each and every word in this sentence to me. When you explain the word, make sure you consider the context the word is in, and include meanings as well as grammatical role of the word. If a word includes abbreviation of articles, make sure you explain that. For all words, always tell me what the original form is if there are any kinds of word transformation involved, for example conjugation or gender agreement. You need to give me your answer in JSON format."
            },
            {
                role: "assistant",
                content: "Can you give me an example of how I should respond to your request?"
            },
            {
                role: "user",
                content: `For example, if I give you the sentence 'Bienvenue, à l'écoute des RFI en direct de Paris.', your response format should be: ${example_response}`
            },
            {
                role: "assistant",
                content: "Understood."
            },
            {
                role: "user",
                content: "Also, please keep all the punctuation marks in the word they are next to. For exmaple, include the '.' in the word 'Paris' when you provide the response."
            },
            {
                role: "assistant",
                content: "OK. Please send me the text you want me to process."
            },
            {
                role: "user",
                "content": sentence
            }
        ],
        model: "gpt-4o",
        response_format: {
            type: "json_object"
        }
    })
    const response = await (await completion).choices[0].message.content;
    const response_in_json = JSON.parse(response!)
    console.log(response_in_json);
    return response_in_json;
}