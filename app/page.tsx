import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react"
import Profile from "@/components/Profile";
import ProjectMade from "@/components/ProjectMade";
import ClientCount from "@/components/ClientCount";
import Link from "next/link";
import ProjectCount from "@/components/ProjectCount";
import TaskCount from "@/components/TaskCount";
import TaskDisplay from "@/components/TasksDisplay";
import AllTools from "@/components/AllTools";

const getGreeting = (): string => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  if (currentHour >= 0 && currentHour < 12) {
    return "good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "good afternoon";
  } else if (currentHour >= 17 && currentHour < 21) {
    return "good evening";
  } else {
    return "good night";
  }
};

export default async function Home() {
  const { userId } = await auth();
  const user = await currentUser();
  const greeting = getGreeting();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  return (
    <div className="md:p-4">
      <div className="flex justify-between lg:hidden mb-5">
        <p className="capitalize text-[14pt] font-bold">{greeting}, {user?.firstName}</p>
      </div>
      <div className="flex gap-4 mb-6">

        <div>
          <Link href={"/addProject"} className="border rounded-md p-2 hover:bg-zinc-800 flex gap-2">

            <Plus className="h-[1.2rem] w-[1.2rem] dark:scale-100" />
            <p>Add Project</p>
          </Link>
        </div>

        <div>
          <Link href={"/addClient"} className="border rounded-md p-2 bg-[#0ddb1785] text-white flex gap-2">
            <p>Add Client</p>
          </Link>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 md:justify-between">
        <div className="w-full">
          <Profile />
        </div>

        <div className="flex flex-col md:flex-row md:justify-end gap-4 w-full">
          <div className="">
            <ClientCount />
          </div>
          <div className="">
            <ProjectCount />
          </div>
          <div className="">
            <TaskCount />
          </div>
        </div>

      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
        <div className="h-[300px] gap-6 border dark:border-slate-700 p-6 rounded-md w-full overflow-y-hidden">
          <p className='mb-3 capitalize'>last 5 tasks</p>
          <div className="h-full overflow-y-scroll">
            <TaskDisplay />
          </div>
        </div>
        <div className=" h-[300px] overflow-y-hidden w-full">
          <p className="font-bold text-lg mb-4">Tools</p>
          <div className="h-full overflow-y-scroll  bg-zinc-200 dark:bg-[#010416d2] rounded-md p-6">
            <AllTools />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="font-bold text-lg mb-4">Projects</p>
        <ProjectMade />
      </div>
    </div>
  );
}
