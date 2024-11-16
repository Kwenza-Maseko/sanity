import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb/mongoose';
import Tool from '@/lib/models/Tool';

export async function POST(req: Request) {
    try {
        console.log('Connecting to the database...');
        await connectToDB();

        const toolData = await req.json();
        console.log('Received tool data:', toolData);

        // Ensure that all required fields are present
        if ( !toolData.toolName || !toolData.toolType) {
            return NextResponse.json(
                { message: 'Missing required fields in tool data' },
                { status: 400 }
            );
        }

        // Create a new Client document
        const tool = new Tool(toolData);
        await tool.save();

        return NextResponse.json({ message: 'Tool added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error while adding tool:', error);

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
