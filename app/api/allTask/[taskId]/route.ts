import Task from "@/lib/models/Tasks";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

interface Params {
    params: {
        taskId: string;
    };
  }
  
  export async function GET(request: Request, context: Params) {
        // Await params before using them
    
    try {
        const { taskId } = await context.params;

        await connectToDB();

        const task = await Task.findOne({ _id: taskId }).sort({ createdAt: -1 }).exec();

        if (!task) {
            return new NextResponse("Task not found", { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("Failed to load task:", error);
        return new NextResponse("Failed to load task", { status: 500 });
    }
}
