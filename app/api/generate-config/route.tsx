import { db } from "@/config/db";
import { openrouter } from "@/config/openroute";
import { projectsTable, ScreenConfigTable } from "@/config/schema";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/Prompt";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userInput, deviceType, projectId } = await req.json();

  const aiResult = await openrouter.chat.send({
    model: "openai/gpt-oss-120b:free",
    messages: [
      {
        role: "user",
        content: `
                ${APP_LAYOUT_CONFIG_PROMPT.replace("{deviceType}", deviceType)}

                USER REQUEST:
                ${userInput}

                IMPORTANT:
                Return ONLY valid JSON. No explanations.
      `,
      },
    ],
    stream: false,
  });

  const JSONAiResult = JSON.parse(
    aiResult.choices[0]?.message?.content as string
  );

  console.log("AI Result", aiResult);

  if (JSONAiResult) {
    //   Update projectsTable with project name
    await db.update(projectsTable).set({
      projectVisualDescription: JSONAiResult?.projectVisualDescription,
      projectName: JSONAiResult?.projectName,
      theme: JSONAiResult?.theme,
    }).where(eq(projectsTable.projectId, projectId as string));

    //   Save to DB ScreenConfigTable
    JSONAiResult.screens?.forEach(async (screen: any) => {
      const result = await db.insert(ScreenConfigTable).values({
        projectId: projectId,
        purpose: screen?.purpose,
        screenId: screen?.id,
        screenDescription: screen?.layoutDescription,
        screenName: screen?.name,
      });
    });
    return NextResponse.json(JSONAiResult);
  } else {
    NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }

}
