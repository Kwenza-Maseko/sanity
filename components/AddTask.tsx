'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useParams } from 'next/navigation';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ToolData {
    _id: string;
    toolName: string;
}

interface ProjectData {
    _id: string;
    projectName: string;
}

const AddTask = () => {
    const { user } = useUser();
    const [taskData, setTaskData] = useState({
        projectId: '', // This will hold the actual project ID for database storage
        taskName: '',
        taskDescription: '',
        tool: '',
        status: 'pending',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [tools, setTools] = useState<ToolData[]>([]);
    const [projectName, setProjectName] = useState(''); // This is for displaying the project name
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id || "";

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/addTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...taskData,
                    creator: user ? user.id : null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add task. Please try again.');
            }

            setSuccessMessage('Task added successfully!');
            setTaskData({
                projectId: id, // Reset projectId to params.id
                taskName: '',
                taskDescription: '',
                tool: '',
                status: 'pending',
            });
        } catch (error) {
            setErrorMessage((error as Error).message || 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Set project ID and fetch the project name when the component mounts
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${id}`);
                const data: ProjectData = await response.json();

                // Set project ID for storing in the database
                setTaskData((prev) => ({ ...prev, projectId: data._id }));
                // Set project name for display
                setProjectName(data.projectName);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };
        fetchProject();
    }, [id]);

    // Fetch tools when the component mounts
    useEffect(() => {
        const fetchTools = async () => {
            try {
                const response = await fetch('/api/displayTool');
                const data = await response.json();
                setTools(data);
            } catch (error) {
                console.error("Error fetching tools:", error);
            }
        };
        fetchTools();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border rounded-md bg-zinc-200 dark:bg-zinc-900">
            <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                    id="projectName"
                    name="projectName"
                    type="text"
                    value={projectName} // Display the project name here
                    readOnly // Make it read-only to avoid user edits
                />
            </div>
            <div>
                <Label htmlFor="taskName">Task Name</Label>
                <Input
                    id="taskName"
                    name="taskName"
                    type="text"
                    value={taskData.taskName}
                    onChange={handleChange}
                    required
                    aria-describedby="taskNameError"
                />
            </div>
            <div>
                <Label htmlFor="taskName">Task Decription</Label>
                <Input
                    id="taskDescription"
                    name="taskDescription"
                    type="text"
                    value={taskData.taskDescription}
                    onChange={handleChange}
                    required
                    aria-describedby="taskDescriptionError"
                />
            </div>
            <div>
                <Label htmlFor="tool">Tool</Label>
                <Select
                    name="tool"
                    value={taskData.tool}
                    onValueChange={(value) => handleChange({ target: { name: 'tool', value } })}
                    required
                    aria-describedby="toolError"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a Tool" />
                    </SelectTrigger>
                    <SelectContent>
                        {tools.map((tool) => (
                            <SelectItem key={tool._id} value={tool._id}>
                                {tool.toolName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="status">Status</Label>
                <Select
                    name="status"
                    value={taskData.status}
                    onValueChange={(value) => handleChange({ target: { name: 'status', value } })}
                    required
                    aria-describedby="statusError"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inProgress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {errorMessage && <p id="taskError" className="text-red-500">{errorMessage}</p>}
            {successMessage && <p id="taskSuccess" className="text-green-500">{successMessage}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding Task...' : 'Add Task'}
            </Button>
        </form>
    );
};

export default AddTask;
