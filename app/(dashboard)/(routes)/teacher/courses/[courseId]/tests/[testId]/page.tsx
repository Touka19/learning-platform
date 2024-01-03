import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CaseUpper } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { VariantsForm } from "./_components/variants-form";
import { TestActions } from "./_components/test-actions";

const TestIdPage = async ({
  params,
}: {
  params: { courseId: string; testId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const test = await db.test.findUnique({
    where: {
      id: params.testId,
      courseId: params.courseId,
    },
    include: {
      variants: true,
    },
  });

  if (!test) {
    return redirect("/");
  }

  const requiredFields = [test.variants.some((variant) => variant.title)];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!test.isPublished && (
        <Banner label="Тест не опубліковано. Він не буде видимим для студентів." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад до налаштувань курсу
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Налаштування тесту</h1>
                <span className="text-sm text-slate-700">
                  Заповніть усі поля {completionText}
                </span>
              </div>
              <TestActions
                disabled={!isComplete}
                courseId={params.courseId}
                testId={params.testId}
                isPublished={test.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CaseUpper} />
                <h2 className="text-xl">Варіанти відповідей</h2>
              </div>
              <VariantsForm
                variants={test.variants}
                testId={params.testId}
                courseId={params.courseId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestIdPage;
