import mongoose, { Schema } from "mongoose";

const ClientSchema = new Schema({
    creator: {
        type: String,  // Change to String since you're using clerkId
        required: true
    },
    clientFirstName: {
        type: String,
        required: true
    },
    clientLastName: {
        type: String,
        required: true
    },
    clientEmail: {
        type: String,
        validate: {
            validator: function(v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props: { value: string }) => `${props.value} is not a valid email!`  // Fix: value is of type string
        },
        required: false
    },
    clientCellNumber: {
        type: String
    },
    companyName: {
        type: String,
        default: "personal service"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Client = mongoose.models.Client || mongoose.model("Client", ClientSchema);

export default Client;
