import Client from "@/lib/models/Client";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

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

    const client = await Client.findOne({ _id: id }).exec();
    if (!client) {
      return new NextResponse("Client not found", { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Failed to load client:", error);
    return new NextResponse("Failed to load client", { status: 500 });
  }
}
