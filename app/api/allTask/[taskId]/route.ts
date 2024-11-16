import Task from "@/lib/models/Tasks";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

interface Params {
    params: {
        taskId: string;
    };
}

export async function GET(request: Request, { params }: Params) {
    try {
        await connectToDB();

        const task = await Task.findOne({ _id: params.taskId }).sort({ createdAt: -1 }).exec();

        if (!task) {
            return new NextResponse("task not found", { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("Failed to load task:", error);
        return new NextResponse("Failed to load task", { status: 500 });
    }
}
