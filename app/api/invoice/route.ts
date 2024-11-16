import Invoice from "@/lib/models/Invoice";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // Connect to MongoDB
        await connectToDB();

        // Find all invoice
        const invoice = await Invoice.find().exec();

        // Check if invoice are found
        if (invoice.length === 0) {
            return new NextResponse('No invoice found', { status: 404 });
        }

        // Return all tool as a JSON response
        return new NextResponse(JSON.stringify(invoice), { status: 200 });
    } catch (error) {
        console.error('Failed to load invoice:', error);
        return new NextResponse('Failed to load invoice', { status: 500 });
    }
};
