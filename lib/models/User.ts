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
    }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;