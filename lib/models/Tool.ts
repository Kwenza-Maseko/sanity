import mongoose, { Schema } from "mongoose";

const ToolSchema = new Schema({
    toolName: {
        type: String,
        required: true
    },
    toolType: {
        type: String,
    }
});

const Tool = mongoose.models.Tool || mongoose.model("Tool", ToolSchema);

export default Tool;