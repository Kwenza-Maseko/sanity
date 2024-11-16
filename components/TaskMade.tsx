'use client';
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";

interface TaskData {
    _id: string;
    creator: string;
    projectId: string;
    taskName: string;
    taskDescription: string;
    tool: string;
    status: string;
    createdAt: Date;
}

interface ProjectData {
    _id: string;
    projectName: string;
}

interface ToolData {
    _id: string;
    toolName: string;
}

const TaskMade = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<{ [key: string]: any }>({});
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [projectNames, setProjectNames] = useState<{ [key: string]: string }>({});
    const [toolNames, setToolNames] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();
    const params = useParams();
    const projectId = params.id;

    // Fetch tasks for the specified project
    const fetchTasks = async () => {
        try {
            const response = await fetch(`/api/taskDisplay/${projectId}`);
            if (!response.ok) throw new Error("Failed to fetch tasks");
            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Expected an array of tasks");
            }

            setTasks(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch individual project name
    const fetchProjectName = async (projectId: string) => {
        if (projectNames[projectId]) return; // Skip if already fetched
        try {
            const response = await fetch(`/api/projects/${projectId}`);
            if (!response.ok) throw new Error(`Failed to fetch project with ID: ${projectId}`);
            const projectData: ProjectData = await response.json();
            setProjectNames((prev) => ({ ...prev, [projectId]: projectData.projectName }));
        } catch (err) {
            console.error("Error fetching project:", err);
            setError(`Error fetching project: ${err}`);
        }
    };

    // Fetch individual tool name
    const fetchToolName = async (toolId: string) => {
        if (toolNames[toolId]) return; // Skip if already fetched
        try {
            const response = await fetch(`/api/displayTool/${toolId}`);
            if (!response.ok) throw new Error(`Failed to fetch tool with ID: ${toolId}`);
            const toolData: ToolData = await response.json();
            setToolNames((prev) => ({ ...prev, [toolId]: toolData.toolName }));
        } catch (err) {
            console.error("Error fetching tool:", err);
            setError(`Error fetching tool: ${err}`);
        }
    };

    // Fetch user data for avatar
    const fetchUser = async (creatorId: string) => {
        if (users[creatorId]) return; // Skip if already fetched
        try {
            const response = await fetch(`/api/user/${creatorId}`);
            if (!response.ok) throw new Error("Failed to fetch user");
            const userData = await response.json();
            setUsers((prevUsers) => ({ ...prevUsers, [creatorId]: userData }));
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    useEffect(() => {
        tasks.forEach((task) => {
            fetchProjectName(task.projectId);
            fetchToolName(task.tool);
            fetchUser(task.creator);
        });
    }, [tasks]);

    if (loading) return <div>Loading tasks...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="mt-6">
            <p className="mb-4 text-lg font-bold">Tasks</p>
            <div className="rounded-md border bg-zinc-200 dark:bg-zinc-900">
                <Table>
                    <TableCaption>A list of your tasks.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task Name</TableHead>
                            <TableHead>Project Name</TableHead>
                            <TableHead>Tool</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created By</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task._id}>
                                <TableCell className="font-bold">{task.taskName}</TableCell>
                                <TableCell>{projectNames[task.projectId]}</TableCell>
                                <TableCell>{toolNames[task.tool]}</TableCell>
                                <TableCell>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <p className={`${task.status === "pending" ? "text-[#ff810c]" : ""
                                        } ${task.status === "completed" ? "text-green-500" : ""}
                                        ${task.status === "inProgress" ? "text-purple-500" : ""}
                                        ${task.status === "archived" ? "text-red-500" : ""}
                                        capitalize`}>
                                        {task.status}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    {users[task.creator]?.profilePhoto ? (
                                        <Link href={`/users/${users[task.creator]?.clerkId}`}>
                                            <Image
                                                src={users[task.creator].profilePhoto}
                                                width={30}
                                                height={30}
                                                alt="User photo"
                                                className="rounded-full"
                                            />
                                        </Link>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Link href={`/projects/${task.projectId}/tasks/${task._id}/addInvoice`}>
                                        <Button className="border rounded-md p-2 hover:bg-zinc-800 flex gap-3">
                                            Make An Invoice
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TaskMade;
