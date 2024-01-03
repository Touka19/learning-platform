"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, Test } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { TestsList } from "./tests-list";

interface TestsFormProps {
  initialData: Course & { tests: Test[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const TestsForm = ({ initialData, courseId }: TestsFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/tests`, values);
      toast.success("Тест створено");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Упс! Щось пішло не так");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/tests/reorder`, {
        list: updateData,
      });
      toast.success("Порядок змінено");
      router.refresh();
    } catch {
      toast.error("Ой! Щось пішло не так");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/tests/${id}`);
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Тестові питання
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Відмінити</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Додати питання
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Приклад: Чому дорінює 2+2?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Створити
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.tests.length && "text-slate-500 italic"
          )}
        >
          {!initialData.tests.length && "Питань немає"}
          <TestsList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.tests || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Перетягніть та утримуйте для зміни порядку
        </p>
      )}
    </div>
  );
};
