import {  NextResponse } from 'next/server';
import Task from '@/lib/models/Tasks';
import { connectToDB } from '@/lib/mongodb/mongoose';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, context: Params) {
  try {
    await connectToDB();

    // Await params before using them
    const { id } = await context.params;
    // Fetch tasks related to the projectId
    const tasks = await Task.find({ projectId: id }).exec();

    if (!tasks || tasks.length === 0) {
      return new NextResponse('Tasks not found', { status: 404 });
    }

    return new NextResponse(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return new NextResponse('Failed to load tasks', { status: 500 });
  }
};
