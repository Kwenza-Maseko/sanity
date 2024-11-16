import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // Connect to MongoDB
        await connectToDB();

        // Find all user
        const user = await User.find().exec();

        // Check if clients are found
        if (user.length === 0) {
            return new NextResponse('No user found', { status: 404 });
        }

        // Return all user as a JSON response
        return new NextResponse(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error('Failed to load user:', error);
        return new NextResponse('Failed to load user', { status: 500 });
    }
};
