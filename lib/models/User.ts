import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    profilePhoto: {
        type: String
    },
    projects: {
        type: [{ type: mongoose.Schema.ObjectId, ref: "Projects" }],
        default: []
    },
    tasks: {
        type: [{ type: mongoose.Schema.ObjectId, ref: "Projects" }],
        default: []
    },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;