import Tool from "@/lib/models/Tool";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // Connect to MongoDB
        await connectToDB();

        // Find all tool
        const tool = await Tool.find().exec();

        // Check if tool are found
        if (tool.length === 0) {
            return new NextResponse('No tool found', { status: 404 });
        }

        // Return all tool as a JSON response
        return new NextResponse(JSON.stringify(tool), { status: 200 });
    } catch (error) {
        console.error('Failed to load tool:', error);
        return new NextResponse('Failed to load tool', { status: 500 });
    }
};
