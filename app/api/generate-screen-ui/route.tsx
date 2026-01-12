import { NextRequest, NextResponse } from "next/server";
import { openrouter } from "@/config/openroute";
import { GENERATION_SCREEN_PROMPT } from "@/data/Prompt";
import { db } from "@/config/db";
import { ScreenConfigTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const {
    projectId,
    screenId,
    screenName,
    purpose,
    screenDescription,
    projectVisualDescription,
  } = await req.json();

  const userInput = `
  screen Name is: ${screenName},
  screen Purpose : ${purpose},
  screen Description : ${screenDescription},
  `;

  try {
    const aiResult = await openrouter.chat.send({
      model: "openai/gpt-oss-120b:free",
      messages: [
        {
          role: "user",
          content: `
                  ${GENERATION_SCREEN_PROMPT}
  
                  USER REQUEST:
                  ${userInput}
  
                  IMPORTANT:
                  Return ONLY valid JSON. No explanations.
        `,
        },
      ],
      stream: false,
    });

    //   Save data to DB or do something with aiResult
    const code = aiResult?.choices[0]?.message?.content;
    const updateResult = await db
      .update(ScreenConfigTable)
      .set({
        code: code as string,
      })
      .where(
        and(
          eq(ScreenConfigTable.projectId, projectId),
          eq(ScreenConfigTable?.screenId, screenId as string)
        )
      )
      .returning();

    return NextResponse.json(updateResult[0]);
  } catch (e) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
