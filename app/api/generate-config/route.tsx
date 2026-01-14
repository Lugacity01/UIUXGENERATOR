import { db } from "@/config/db";
import { openrouter } from "@/config/openroute";
import { projectsTable, ScreenConfigTable } from "@/config/schema";
import {
  APP_LAYOUT_CONFIG_PROMPT,
  GENERATE_NEW_SCREEN_IN_EXISTING_PROJECT_PROJECT,
} from "@/data/Prompt";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userInput, deviceType, projectId, oldScreenDescription, theme } =
    await req.json();

  const aiResult = await openrouter.chat.send({
    model: "openai/gpt-oss-120b:free",
    messages: [
      {
        role: "user",
        content: `
                ${
                  oldScreenDescription
                    ? GENERATE_NEW_SCREEN_IN_EXISTING_PROJECT_PROJECT.replace(
                        "{deviceType}",
                        deviceType
                      )
                    : APP_LAYOUT_CONFIG_PROMPT.replace(
                        "{deviceType}",
                        deviceType
                      ).replace("{theme}", theme)
                }
                USER REQUEST:
                ${
                  oldScreenDescription
                    ? userInput +
                      "Old Screen Description is: " +
                      oldScreenDescription
                    : userInput
                }

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
 !oldScreenDescription &&   await db
      .update(projectsTable)
      .set({
        projectVisualDescription: JSONAiResult?.projectVisualDescription,
        projectName: JSONAiResult?.projectName,
        theme: JSONAiResult?.theme,
      })
      .where(eq(projectsTable.projectId, projectId as string));

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

export async function DELETE(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  const screenId = req.nextUrl.searchParams.get("screenId");

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ msg: "Unauthorized User", status: 400 });
  }

  const result = await db
    .delete(ScreenConfigTable)
    .where(
      and(
        eq(ScreenConfigTable.screenId, screenId as string),
        eq(ScreenConfigTable.projectId, projectId as string)
      )
    );

  return NextResponse.json({ mesg: "Deleted Successfully" });
}
