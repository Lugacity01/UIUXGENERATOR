import { db } from "@/config/db";
import { projectsTable, ScreenConfigTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {userInput, device, projectId} = await req.json();
    const user = await currentUser();
    
    const result = await db.insert(projectsTable).values({
        projectId: projectId,
        userId: user?.primaryEmailAddress?.emailAddress as string,
        device: device,
        userInput: userInput,
    }).returning();
    
    return NextResponse.json(result[0]);

}

export async function GET(req: NextRequest){
    const projectId = await req.nextUrl.searchParams.get("projectId") as string;
    const user = await currentUser();

    try {
        const result = await db.select().from(projectsTable).where(and(eq(projectsTable.projectId, projectId as string), eq(projectsTable.userId, user?.primaryEmailAddress?.emailAddress as string)));

        const ScreenConfig = await db.select().from(ScreenConfigTable).where(eq(ScreenConfigTable.projectId, projectId as string));
        return NextResponse.json({
            projectDetail: result[0],
            screenConfig: ScreenConfig
        });


    } catch (e) {
         return NextResponse.json({msg: " Failed to fetch project"}, {status: 500});
    }

}


export async function PUT(req: NextRequest){

    const {projectName, theme, projectId} = await req.json()

    const result = await db.update(projectsTable).set({
        projectName: projectName,
        theme: theme,
        
    }).where(eq(projectsTable.projectId, projectId))
    .returning()

    return NextResponse.json(result[0])

}