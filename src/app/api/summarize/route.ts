
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey) {
    console.error("GROQ_API_KEY is not set in environment variables.");
  
}
const groq = new Groq({ apiKey: groqApiKey });

export async function POST(request: Request) {
   
    if (!groqApiKey) {
        return NextResponse.json(
            { error: "API key not configured correctly." },
            { status: 500 }
        );
    }

    try {
   
        const body = await request.json();
        const contentToSummarize = body.content;

        if (!contentToSummarize || typeof contentToSummarize !== 'string') {
            return NextResponse.json(
                { error: "Invalid input: 'content' field is missing or not a string." },
                { status: 400 } 
            );
        }

        
        const prompt = `Please provide a concise summary (2-3 sentences) of the following text:\n\n${contentToSummarize}`;
        console.log("[Summarize API] Calling Groq API...");
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama3-8b-8192",
        });
        const summary = chatCompletion.choices[0]?.message?.content?.trim() || null;

        if (!summary) {
            console.error("[Summarize API] Groq response did not contain a summary.");
            return NextResponse.json(
                { error: "Failed to generate summary from AI." },
                { status: 500 }
            );
        }

        console.log("[Summarize API] Summary generated successfully.");
        return NextResponse.json({ summary });

    } catch (error: unknown) {
        console.error("[Summarize API] Error:", error);

        let errorDetails = 'An unknown error occurred.';
        if (error instanceof Error) {
            errorDetails = error.message;
        } else if (typeof error === 'string') {
            errorDetails = error;
        }
        return NextResponse.json(
            { error: "An error occurred during summarization.", details: errorDetails },
            { status: 500 }
        );
    }
}