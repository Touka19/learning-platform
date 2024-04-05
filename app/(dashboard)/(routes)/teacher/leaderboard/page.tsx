// page.tsx
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { LeaderboardEntry, getLeaderboard } from "@/actions/get-leaderboard";

const LeaderboardPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  let leaderboardData: LeaderboardEntry[] = [];

  try {
    leaderboardData = await getLeaderboard();
    // Check if leaderboardData is not an array
    if (!Array.isArray(leaderboardData)) {
      throw new Error("Leaderboard data is not an array.");
    }
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    // Provide a fallback value
    leaderboardData = [];
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <ul>
        {leaderboardData.map((entry, index) => (
          <li key={index}>
            User ID: {entry.userId}, 
            Completed Chapters: {entry.total_completed_chapters}, 
            Total Chapters: {entry.total_chapters_in_courses}, 
            Courses Completed: {entry.course_completed}
          </li>
        ))}
      </ul>
    </div>
  );
};
 
export default LeaderboardPage;