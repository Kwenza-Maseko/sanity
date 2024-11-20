import Task from "@/lib/models/Tasks";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { taskId: string } }) {
    const { taskId } = context.params;

    try {
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
