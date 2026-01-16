export type ProjectType = {
    id: number,
    projectId: string,
    device: string,
    userInput: string,
    createdOn: string,
    createdAt: string,
    projectName?: string,
    theme?: string,
    screenShot?: any,
}


export type ScreenConfig = {
    id: number,
    screenId: string,
    screenName: string,
    purpose: string,
    screenDescription: string,
    code?: string,
}


// export type Screen = {
//     id: number,
//     screenId: string,
//     screenName: string,
//     purpose: string,
//     screenDescription: string,
//     code?: string,
// }