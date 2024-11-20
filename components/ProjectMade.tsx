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
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProjectData {
    _id: string;
    creator: string;
    projectName: string;
    projectType: string;
    client: string;
    isInternalProject: string;
    status: string;
    tools: string;
    createdAt: Date;
    clientFirstName?: string;
    clientLastName?: string;
}

interface UserData {
    clerkId: string;
    profilePhoto: string;
    firstName: string;
    lastName: string;
}

interface ClientData {
    _id: string;
    clientFirstName: string;
    clientLastName: string;
}

const ProjectMade = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<{ [key: string]: UserData }>({});
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showOnlyMyProject, setShowOnlyMyProject] = useState(false);
    const { user } = useUser();
    const [openProjectId, setOpenProjectId] = useState<string | null>(null);

    const getProject = async () => {
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) throw new Error('Failed to fetch projects');
            const data = await response.json();
            if (data.length === 0) throw new Error('No projects found');
            setProjects(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getUser = async (creatorId: string) => {
        try {
            const response = await fetch(`/api/user/${creatorId}`);
            if (!response.ok) throw new Error('Failed to fetch user');
            const userData = await response.json();
            setUsers((prevUsers) => ({ ...prevUsers, [creatorId]: userData }));
        } catch (err: any) {
            console.error("Error fetching user:", err);
        }
    };

    const getClientName = async (clientId: string, projectId: string) => {
        try {
            const response = await fetch(`/api/clienthook/${clientId}`);
            if (!response.ok) throw new Error("Failed to fetch client");
            const clientData = await response.json();

            setProjects(prevProjects =>
                prevProjects.map(project =>
                    project._id === projectId
                        ? { ...project, clientFirstName: clientData.clientFirstName, clientLastName: clientData.clientLastName }
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
            if (!users[project.creator]) getUser(project.creator);
            if (!project.clientFirstName) getClientName(project.client, project._id);
        });
    }, [projects]);

    if (loading) return <div>Loading Projects...</div>;
    if (error) return <div>{error}</div>;

    const displayedProjects = showOnlyMyProject
        ? projects.filter(project => project.creator === user?.id)
        : projects;

    return (
        <div className="rounded-md bg-zinc-200 border dark:border-slate-800 dark:bg-[#010416d2]">
            <Button onClick={() => setShowOnlyMyProject(!showOnlyMyProject)} className="mb-4 p-2 rounded m-4">
                {showOnlyMyProject ? "Show All Projects" : "Show My Projects"}
            </Button>
            <Table>
                <TableCaption>A list of your projects.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created By</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayedProjects.map((project) => (
                        <TableRow key={project._id}>
                            <TableCell className="font-medium">{project.projectName}</TableCell>
                            <TableCell>{project.projectType}</TableCell>
                            <TableCell>{project.clientFirstName || "No client name"} {project.clientLastName || ""}</TableCell>
                            <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <p className={`capitalize ${{
                                    pending: "text-[#ff810c]",
                                    completed: "text-green-500",
                                    inProgress: "text-purple-500",
                                    archived: "text-red-500",
                                }[project.status] || ""}`}>
                                    {project.status}
                                </p>
                            </TableCell>
                            <TableCell className="flex items-center">
                                {users[project.creator]?.profilePhoto ? (
                                    <Link href={`/users/${users[project.creator].clerkId}`}>
                                        <Image src={users[project.creator].profilePhoto} width={30} height={30} alt="User photo" className="rounded-full" />
                                    </Link>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                )}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" onClick={() => setOpenProjectId(openProjectId === project._id ? null : project._id)}>
                                            <HiOutlineDotsVertical />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    {openProjectId === project._id && (
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Link href={`projects/${project._id}`}>Show Project</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link href={`allclients/${project.client}`}>Go to Client</Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    )}
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ProjectMade;
