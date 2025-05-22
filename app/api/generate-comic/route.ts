// File: app/api/generate-comic/route.ts
import { NextResponse } from "next/server";

export const maxDuration = 60; // Optional: extend timeout for Vercel

export async function POST(req: Request) {
    const { story, characters } = await req.json();

    if (!story || !characters || characters.length === 0) {
        return NextResponse.json({ error: "Missing story or characters." }, { status: 400 });
    }

    try {
        const panelPrompt = `
You're a comic scriptwriter. Break this story into 3 comic panels. 
For each panel, describe:
- The **image prompt** for DALL·E
- The **speech or narration text** to be shown

Story: "${story}"

Characters involved: ${characters.map((c: any) => c.name).join(", ")}

Please ONLY return valid JSON in the format below:
[
  { "imagePrompt": "...", "text": "..." },
  { "imagePrompt": "...", "text": "..." },
  { "imagePrompt": "...", "text": "..." }
]
`;

        const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4.1-turbo",
                messages: [{ role: "user", content: panelPrompt }],
                temperature: 0.7,
            }),
        });

        const gptData = await gptRes.json();

        if (!gptData.choices || !gptData.choices[0]?.message?.content) {
            console.error("Unexpected OpenAI response:", JSON.stringify(gptData, null, 2));
            return NextResponse.json({ error: "Unexpected response from OpenAI." }, { status: 500 });
        }

        let panels: { imagePrompt: string; text: string }[];

        try {
            panels = JSON.parse(gptData.choices[0].message.content);
        } catch (err) {
            console.error("Failed to parse GPT content as JSON:", gptData.choices[0].message.content);
            return NextResponse.json({ error: "Invalid GPT JSON output." }, { status: 500 });
        }

        // Step 2: Generate images using DALL·E for each panel
        const dalleImages: string[] = [];

        for (const panel of panels) {
            const dalleRes = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: panel.imagePrompt,
                    n: 1,
                    size: "512x768", // portrait-style
                    response_format: "url",
                }),
            });

            const dalleData = await dalleRes.json();
            if (!dalleData.data || !dalleData.data[0]?.url) {
                console.error("DALL·E image generation failed for prompt:", panel.imagePrompt, dalleData);
                return NextResponse.json({ error: "DALL·E image generation failed." }, { status: 500 });
            }

            dalleImages.push(dalleData.data[0].url);
        }

        // Combine panels with their images
        const finalComic = panels.map((panel, index) => ({
            ...panel,
            imageUrl: dalleImages[index],
        }));

        return NextResponse.json(finalComic);
    } catch (error) {
        console.error("Comic panel generation failed", error);
        return NextResponse.json({ error: "Failed to generate comic." }, { status: 500 });
    }
}
