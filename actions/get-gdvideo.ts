import { db } from "@/lib/db";

interface GDVideo {
    id: string;
    name: string;
    folderId: string;
}

export const getVideos = async (): Promise<GDVideo[]> => {
    try {
        const videos = await db.gDVideo.findMany();
        return videos;
    } catch (error) {
        console.log("[GET_VIDEOS]", error);
        return [];
    }
}