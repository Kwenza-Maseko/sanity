// app/api/clients/count/route.ts

import Task from "@/lib/models/Tasks";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // Connect to MongoDB
        await connectToDB();

        // task all clients
        const count = await Task.countDocuments();

        // Return the task as a JSON response
        return new NextResponse(JSON.stringify({ count }), { status: 200 });
    } catch (error) {
        console.error('Failed to count clients:', error);
        return new NextResponse('Failed to count clients', { status: 500 });
    }
};
