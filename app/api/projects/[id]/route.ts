import { NextResponse } from 'next/server';
import Project from '@/lib/models/Projects';
import { connectToDB } from '@/lib/mongodb/mongoose';

interface Params {
  params: {
      id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    await connectToDB();
    
    // Fetch Project by clerkId and populate related fields
    const project = await Project.findOne({ _id: params.id }).sort({ createdAt: -1 })
      .exec();

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    return new NextResponse(JSON.stringify(project), { status: 200 });
  } catch (error) {
    console.error('Failed to load Project:', error);
    return new NextResponse('Failed to load Project', { status: 500 });
  }
};
