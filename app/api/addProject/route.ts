import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb/mongoose';
import Project from '@/lib/models/Projects';
import User from '@/lib/models/User'; // Assuming you have the User model to validate the clerkId

export async function POST(req: Request) {
    try {
        console.log('Connecting to the database...');
        await connectToDB();

        const projectData = await req.json();
        console.log('Received project data:', projectData);

        // Ensure that all required fields are present
        if (!projectData.creator || !projectData.projectName || !projectData.projectType) {
            return NextResponse.json(
                { message: 'Missing required fields in project data' },
                { status: 400 }
            );
        }

        // Validate the creator (clerkId) exists in the User collection
        const user = await User.findOne({ clerkId: projectData.creator });
        if (!user) {
            return NextResponse.json(
                { message: 'Creator with the provided clerkId does not exist' },
                { status: 404 }
            );
        }

        // Create a new Client document
        const client = new Project(projectData);
        await client.save();

        return NextResponse.json({ message: 'Project added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error while adding project:', error);

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

        return NextResponse.json({ message: 'Error adding project', error: errorMessage }, { status: 500 });
    }
}
