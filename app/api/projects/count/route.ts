// app/api/clients/count/route.ts

import Project from "@/lib/models/Projects";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // Connect to MongoDB
        await connectToDB();

        // Count all clients
        const count = await Project.countDocuments();

        // Return the count as a JSON response
        return new NextResponse(JSON.stringify({ count }), { status: 200 });
    } catch (error) {
        console.error('Failed to count project:', error);
        return new NextResponse('Failed to count project', { status: 500 });
    }
};
