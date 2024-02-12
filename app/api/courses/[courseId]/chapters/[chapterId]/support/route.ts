import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      question: string;
      courseTitle: string;
      chapterTitle: string;
      chapterDescription: string;
    };
  }
) {
  try {
    const { question, courseTitle, chapterTitle, chapterDescription } =
      await req.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!question || !courseTitle || !chapterTitle || !chapterDescription) {
      return new NextResponse(
        "Required payload: course title, chapter title, chapter description, question",
        {
          status: 400,
        }
      );
    }

    if (!question || !courseTitle || !chapterTitle || !chapterDescription) {
      return new NextResponse("Course and topic are required", {
        status: 400,
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Твоє завдання консультувати студентів з онлайн-курсу "${courseTitle}" по розділу "${chapterTitle}" із наступним змістом "${chapterDescription}". Відповіді повинні бути чіткими та лаконічними.`,
        },
        { role: "user", content: question },
      ],
      max_tokens: 450,
    });

    return NextResponse.json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.log("[CHAPTER_ID_SUPPORT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
