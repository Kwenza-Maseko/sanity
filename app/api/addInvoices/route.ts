import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb/mongoose';
import Invoice from '@/lib/models/Invoice';
import User from '@/lib/models/User';

export async function POST(req: Request) {
    try {
        console.log('Connecting to the database...');
        await connectToDB();

        const invoiceData = await req.json();
        console.log('Received invoice data:', invoiceData);

        // Ensure that all required fields are present
        if (!invoiceData.creator) {
            return NextResponse.json(
                { message: 'Missing required fields in invoice data' },
                { status: 400 }
            );
        }

        // Validate the creator (clerkId) exists in the User collection
        const user = await User.findOne({ clerkId: invoiceData.creator });
        if (!user) {
            return NextResponse.json(
                { message: 'Creator with the provided clerkId does not exist' },
                { status: 404 }
            );
        }

        // Create a new Invoice document
        const invoice = new Invoice(invoiceData);
        await invoice.save();

        return NextResponse.json({ message: 'Invoice added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error while adding invoice:', error);

        let errorMessage = 'An unknown error occurred';
        
        // Log full error stack if available
        if (error instanceof Error) {
            console.error('Error stack:', error.stack);  // Log full stack trace
            if (error.name === 'ValidationError') {
                errorMessage = `Validation error: ${error.message}`;
            } else {
                errorMessage = error.message;
            }
        } else {
            errorMessage = 'Unknown error format';
        }

        return NextResponse.json({ message: 'Error adding invoice', error: errorMessage }, { status: 500 });
    }
}
