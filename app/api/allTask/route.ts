import Task from "@/lib/models/Tasks";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // Connect to MongoDB
        await connectToDB();

        // Find the latest 5 tasks, sorted by creation date in descending order
        const tasks = await Task.find().sort({ createdAt: -1 }).limit(5).exec();

        // Check if tasks are found
        if (tasks.length === 0) {
            return new NextResponse('No tasks found', { status: 404 });
        }

        // Return the latest 5 tasks as a JSON response
        return new NextResponse(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
        console.error('Failed to load tasks:', error);
        return new NextResponse('Failed to load tasks', { status: 500 });
    }
};
