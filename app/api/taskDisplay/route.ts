import Task from "@/lib/models/Tasks";
import { connectToDB } from "@/lib/mongodb/mongoose";
import {  NextResponse } from "next/server"

export const GET = async () => {
    try {
        await connectToDB();

        const task = await Task.find().sort({ createdAt: -1 })
            .exec();

        if (!task) {
            return new NextResponse('task not found', { status: 404 });
        }

        return new NextResponse(JSON.stringify(task), { status: 200 });
    } catch (error) {
        console.error('Failed to load task:', error);
        return new NextResponse('Failed to load task', { status: 500 });
    }
};