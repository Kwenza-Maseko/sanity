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
import { HiOutlineDotsVertical } from "@react-icons/all-files/hi/HiOutlineDotsVertical";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react'
import TaskMade from "@/components/TaskMade";

interface ProjectData {
    _id: string;
    creator: string;
    projectName: string;
    projectType: string;
    client: string; // Client ID
    isInternalProject: string;
    status: string;
    createdAt: Date;
    clientFirstName?: string; // Add this optional property
    clientLastName?: string; // Add this optional property
}

interface UserData {
    clerkId: string;
    profilePhoto: string;
}

interface ClientData {
    _id: string;
    clientFirstName: string;
    clientLastName: string;
}

const page = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<{ [key: string]: UserData }>({});
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [clients, setClients] = useState<{ [key: string]: ClientData }>({});
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();
    const path = useParams();
    const projectId = path.id;

    const getProject = async () => {
        try {
            const response = await fetch(`/api/projects/${projectId}`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            const data = await response.json();

            // Ensure that `data` is an array
            if (Array.isArray(data)) {
                setProjects(data);
            } else {
                setProjects([data]); // Wrap in an array if it's a single object
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getClientName = async (clientId: string, projectId: string) => {
        try {
            const response = await fetch(`/api/clienthook/${clientId}`);
            if (!response.ok) throw new Error("Failed to fetch client");
            const clientData = await response.json();

            // Update the specific project with the client's first name
            setProjects(prevProjects =>
                prevProjects.map(project =>
                    project._id === projectId
                        ? {
                            ...project,
                            clientFirstName: clientData.clientFirstName,
                            clientLastName: clientData.clientLastName
                        }
                        : project
                )
            );
        } catch (err: any) {
            console.error("Error fetching client:", err);
        }
    };


    useEffect(() => {
        getProject();
    }, []);

    useEffect(() => {
        projects.forEach((project) => {
            if (!project.clientFirstName) {
                getClientName(project.client, project._id);
            }
        });
    }, [projects]);


    if (loading) return <div>Loading Projects...</div>;
    if (error) return <div>{error}</div>;



    return (
        <div >

            <div className="flex justify-between">
                <div className="rounded-md bg-zinc-100 border dark:bg-zinc-900 p-4 w-fit">
                    {Array.isArray(projects) && projects.length > 0 ? (
                        projects.map((project) => (
                            <div key={project._id}>
                                <div className="flex flex-col gap-2">
                                    <div className="mb-3">
                                        <p className="text-lg font-bold">{project.projectName}</p>
                                        <Link href={`/allclients/${project.client}`} className="hover:text-zinc-500">
                                            <p>{project.clientFirstName} {project.clientLastName}</p>
                                        </Link>
                                    </div>
                                    <p>Type: {project.projectType}</p>
                                    <p>Created At: {new Date(project.createdAt).toLocaleDateString()}</p>
                                    <p>Status:
                                        <span className={`
                                        ${project.status === "pending" ? "text-[#ff810c]" : ""}
                                        ${project.status === "completed" ? "text-green-500" : ""}
                                        ${project.status === "inProgress" ? "text-purple-500" : ""}
                                        ${project.status === "archived" ? "text-red-500" : ""}
                                        capitalize`}> {project.status}</span>
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No projects found</p>
                    )}
                </div>

                <div className="flex gap-4">
                    <div className="flex gap-4">
                        <Link href={`/projects/${projectId}/tasks`}>
                            <div className="border rounded-md p-2 hover:bg-zinc-800 flex gap-3">
                                <Plus className="h-[1.2rem] w-[1.2rem] dark:scale-100" />
                                <p>Add Task</p>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>
            <div className="mt-4">
                <TaskMade />
            </div>
        </div>
    );

};

export default page;
