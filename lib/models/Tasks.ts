import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
    creator: {
        type: String,
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    taskName: {
        type: String,
        required: true
    },
    taskDescription: { // Corrected spelling
        type: String,
        required: true
    },
    tool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tool",
        default: null // or an actual Tool ID for default tasks if needed
    },
    status: {
        type: String,
        enum: ["pending", "inProgress", "completed", "archived"],
        default: "pending"
    }
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt`

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
