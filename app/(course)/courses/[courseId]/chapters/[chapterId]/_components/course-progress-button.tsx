"use client";

import axios from "axios";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
  showTests: () => void;
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
  showTests,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
        setTimeout(() => showTests(), 3000);
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Прогрес курсу оновлено");
      router.refresh();
    } catch {
      toast.error("Ой! Щось пішло не так");
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isCompleted ? X : Check;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      variant="secondary"
      className="w-full md:w-auto"
    >
      <Icon className="h-5 w-5 mr-2" />
      {isCompleted ? "Позначити як не завершений" : "Позначити як завершений"}
    </Button>
  );
};
