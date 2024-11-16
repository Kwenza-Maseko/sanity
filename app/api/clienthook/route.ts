import Client from "@/lib/models/Client";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // Connect to MongoDB
        await connectToDB();

        // Find all clients
        const clients = await Client.find().sort({ createdAt: -1 }).exec();

        // Check if clients are found
        if (clients.length === 0) {
            return new NextResponse('No clients found', { status: 404 });
        }

        // Return all clients as a JSON response
        return new NextResponse(JSON.stringify(clients), { status: 200 });
    } catch (error) {
        console.error('Failed to load client:', error);
        return new NextResponse('Failed to load client', { status: 500 });
    }
};
