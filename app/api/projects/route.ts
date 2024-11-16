import Project from "@/lib/models/Projects";
import { connectToDB } from "@/lib/mongodb/mongoose";
import {  NextResponse } from "next/server"

export const GET = async () => {
    try {
        await connectToDB();

        const project = await Project.find().sort({ createdAt: -1 })
            .exec();

        if (!project) {
            return new NextResponse('project not found', { status: 404 });
        }

        return new NextResponse(JSON.stringify(project), { status: 200 });
    } catch (error) {
        console.error('Failed to load user:', error);
        return new NextResponse('Failed to load project', { status: 500 });
    }
};