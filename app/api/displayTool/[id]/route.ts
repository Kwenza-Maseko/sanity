import { NextResponse } from 'next/server';
import Tool from '@/lib/models/Tool';
import { connectToDB } from '@/lib/mongodb/mongoose';

interface Params {
  params: {
      id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    await connectToDB();
    
    // Fetch tool by clerkId and populate related fields
    const tool = await Tool.findOne({ _id: params.id })
      .exec();

    if (!tool) {
      return new NextResponse('tool not found', { status: 404 });
    }

    return new NextResponse(JSON.stringify(tool), { status: 200 });
  } catch (error) {
    console.error('Failed to load tool:', error);
    return new NextResponse('Failed to load tool', { status: 500 });
  }
};
