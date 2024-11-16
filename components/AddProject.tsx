'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ClientData {
    _id: string;
    clientFirstName: string;
    clientLastName: string; // Adjust this field name according to your client data structure
}

const AddProject = () => {
    const { user } = useUser();
    const router = useRouter();
    const [projectData, setProjectData] = useState({
        projectName: '',
        projectType: '',
        client: '',
        isInternalProject: 'yes',
        status: 'pending',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [clients, setClients] = useState<ClientData[]>([]);

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setProjectData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/addProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...projectData,
                    creator: user ? user.id : null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add project. Please try again.');
            }

            setSuccessMessage('Project added successfully!');
            setProjectData({
                projectName: '',
                projectType: '',
                client: '',
                isInternalProject: 'yes',
                status: 'pending',
            });
            router.push('/projects');
        } catch (error) {
            setErrorMessage((error as Error).message || 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch clients when the component mounts
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('/api/clienthook');
                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };
        fetchClients();
    }, []);


    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border rounded-md bg-zinc-200 dark:bg-zinc-900">
            <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                    id="projectName"
                    name="projectName"
                    type="text"
                    value={projectData.projectName}
                    onChange={handleChange}
                    required
                    aria-describedby="projectNameError"
                />
            </div>
            <div>
                <Label htmlFor="projectType">Project Type</Label>
                <Input
                    id="projectType"
                    name="projectType"
                    type="text"
                    value={projectData.projectType}
                    onChange={handleChange}
                    required
                    aria-describedby="projectTypeError"
                />
            </div>
            <div>
                <Label htmlFor="client">Client</Label>
                <Select
                    name="client"
                    value={projectData.client}
                    onValueChange={(value) => handleChange({ target: { name: 'client', value } })}
                    required
                    aria-describedby="clientError"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a Client" />
                    </SelectTrigger>
                    <SelectContent>
                        {clients.map((client) => (
                            <SelectItem key={client._id} value={client._id}>
                                {client.clientFirstName} {client.clientLastName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="internalwork">Is it Iternal Work</Label>
                <Select
                    name="internalwork"
                    value={projectData.isInternalProject}
                    onValueChange={(value) => handleChange({ target: { name: 'internalwork', value } })}
                    required
                    aria-describedby="internalworkError"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="status">Status</Label>
                <Select
                    name="status"
                    value={projectData.status}
                    onValueChange={(value) => handleChange({ target: { name: 'status', value } })}
                    required
                    aria-describedby="statusError"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">pending</SelectItem>
                        <SelectItem value="inProgress">inProgress</SelectItem>
                        <SelectItem value="completed">completed</SelectItem>
                        <SelectItem value="archived">archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {errorMessage && <p id="projectError" className="text-red-500">{errorMessage}</p>}
            {successMessage && <p id="projectSuccess" className="text-green-500">{successMessage}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding Project...' : 'Add Project'}
            </Button>
        </form>
    );
};

export default AddProject;
