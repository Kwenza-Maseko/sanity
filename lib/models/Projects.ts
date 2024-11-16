import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema({
    creator: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        default: null 
    },
    isInternalProject: {
        type: String,
        default: "yes"
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "inProgress", "completed", "archived"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
