import { db } from "@/config/db";
import { openrouter } from "@/config/openroute";
import { ScreenConfigTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { projectId, screenId, oldCode, userInput } = await req.json();

  const USER_INPUT = `
${oldCode}

Make changes as per user input in this code, keeping design and style the same.
Do not change the existing layout or styling.
Just make the user requested changes.

UserInput is: ${userInput}
`;

  try {
    const aiResult = await openrouter.chat.send({
      model: "openai/gpt-oss-120b:free",
      messages: [
        {
          role: "user",
          content: `
USER REQUEST:
${USER_INPUT}

IMPORTANT:
Return ONLY valid HTML. No explanations.
          `,
        },
      ],
      stream: false,
    });

    const code = aiResult?.choices[0]?.message?.content;

    const updateResult = await db
      .update(ScreenConfigTable)
      .set({
        code: code as string,
      })
      .where(
        and(
          eq(ScreenConfigTable.projectId, projectId),
          eq(ScreenConfigTable.screenId, screenId as string)
        )
      )
      .returning();

    return NextResponse.json(updateResult[0]);
  } catch (e) {
    return NextResponse.json(
      { msg: "Internal Server Error" },
      { status: 500 }
    );
  }
}
