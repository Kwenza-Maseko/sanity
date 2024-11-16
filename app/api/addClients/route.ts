import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb/mongoose';
import Client from '@/lib/models/Client';
import User from '@/lib/models/User'; // Assuming you have the User model to validate the clerkId

export async function POST(req: Request) {
    try {
        console.log('Connecting to the database...');
        await connectToDB();

        const clientData = await req.json();
        console.log('Received client data:', clientData);

        // Ensure that all required fields are present
        if (!clientData.creator || !clientData.clientFirstName || !clientData.clientLastName) {
            return NextResponse.json(
                { message: 'Missing required fields in client data' },
                { status: 400 }
            );
        }

        // Validate the creator (clerkId) exists in the User collection
        const user = await User.findOne({ clerkId: clientData.creator });
        if (!user) {
            return NextResponse.json(
                { message: 'Creator with the provided clerkId does not exist' },
                { status: 404 }
            );
        }

        // Optional: Validate the clientEmail format if provided
        if (clientData.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.clientEmail)) {
            return NextResponse.json(
                { message: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Create a new Client document
        const client = new Client(clientData);
        await client.save();

        return NextResponse.json({ message: 'Client added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error while adding client:', error);

        let errorMessage = 'An unknown error occurred';
        
        // Handle known error types
        if (error instanceof Error) {
            if (error.name === 'ValidationError') {
                errorMessage = `Validation error: ${error.message}`;
            } else {
                errorMessage = error.message;
            }
        } else {
            errorMessage = 'Unknown error format';
        }

        // Log the error details
        console.error('Error details:', error);

        return NextResponse.json({ message: 'Error adding client', error: errorMessage }, { status: 500 });
    }
}
