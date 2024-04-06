"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { db } from "@/lib/db";

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

interface VideoOption {
  id: string;
  name: string;
}

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [videoOptions, setVideoOptions] = useState<VideoOption[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | undefined>(
    initialData.videoUrl ?? undefined
  );

  const router = useRouter();

  const fetchVideoOptions = async () => {
    try {
      const videos = await db.gDVideo.findMany();
      setVideoOptions(videos);
    } catch (error) {
      console.error("Error fetching video options:", error);
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async () => {
    try {
      if (selectedVideoId) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}`,
          { videoUrl: selectedVideoId }
        );
        toast.success("The section has been updated");
        toggleEdit();
        router.refresh();
      } else {
        toast.error("Please select a video");
      }
    } catch {
      toast.error("Oh! Something went wrong");
    }
  };

  // Fetch video options when component mounts
  fetchVideoOptions();

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video section
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? "To cancel" : (initialData.videoUrl ? "Change the video" : "Add video")}
        </Button>
      </div>
      {!isEditing && (
        <div>
          {initialData.videoUrl ? (
            <div className="relative aspect-video mt-2">
              <video src={initialData.videoUrl} className="w-full h-full" controls />
            </div>
          ) : (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <Video className="h-10 w-10 text-slate-500" />
            </div>
          )}
          {initialData.videoUrl && (
            <div className="text-xs text-muted-foreground">
              Video processing may take a while. Try updating the page if the video is not displayed.
            </div>
          )}
        </div>
      )}
      {isEditing && (
        <div>
          <select
            value={selectedVideoId}
            onChange={(e) => setSelectedVideoId(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a video</option>
            {videoOptions.map((video) => (
              <option key={video.id} value={video.id}>
                {video.name}
              </option>
            ))}
          </select>
          <div className="text-xs text-muted-foreground mt-4">
            Select a video for this section
          </div>
          <Button onClick={onSubmit} className="mt-4">
            Save
          </Button>
        </div>
      )}
    </div>
  );
};
