import Invoice from "@/lib/models/Invoice";
import { connectToDB } from "@/lib/mongodb/mongoose";
import { NextResponse } from "next/server";

interface Params {
    params: {
        invoiceNumber: string; // this is expected to be the invoiceNumber
    };
}

export async function GET(request: Request, { params }: Params) {
    try {
        // Log the params to check if the invoiceNumber is received
        console.log("Received invoice number from params:", params.invoiceNumber);

        await connectToDB();

        const invoice = await Invoice.findOne({ invoiceNumber: params.invoiceNumber }).exec();
        if (!invoice) {
            return new NextResponse("Invoice not found", { status: 404 });
        }

        return NextResponse.json(invoice);
    } catch (error) {
        console.error("Failed to load invoice:", error);
        return new NextResponse("Failed to load invoice", { status: 500 });
    }
}
