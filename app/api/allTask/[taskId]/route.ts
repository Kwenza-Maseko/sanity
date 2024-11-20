import Task from "@/lib/models/Tasks";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

interface Params {
    params: {
      id: string;
    };
  }
  
  export async function GET(request: Request, context: Params) {
    try {
      await connectToDB();
  
      // Await params before using them
      const { id } = await context.params;

        const task = await Task.findOne({ _id: id }).sort({ createdAt: -1 }).exec();

        if (!task) {
            return new NextResponse("Task not found", { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("Failed to load task:", error);
        return new NextResponse("Failed to load task", { status: 500 });
    }
}
