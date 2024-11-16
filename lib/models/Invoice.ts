import mongoose, { Schema, CallbackError } from "mongoose";

const InvoiceSchema = new Schema({
    creator: {
        type: String,
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    unitPrice: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true,
        default: "0"
    },
    quantity: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    invoiceNumber: {
        type: String,  // Keep it as a String for formatted invoice number
        unique: true,
        required: true
    }
});

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

export default Invoice;
