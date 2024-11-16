'use client';
import { useState } from 'react';
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

const AddTool = () => {
    const { user } = useUser();
    const router = useRouter();
    const [toolData, setToolData] = useState({
        toolName: '',
        toolType: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setToolData((prev) => ({ ...prev, [name]: value }));
    };
    const handleToolTypeChange = (value: any) => {
        setToolData((prev) => ({ ...prev, toolType: value }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/addTools', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...toolData,
                    creator: user ? user.id : null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add tool. Please try again.');
            }

            setSuccessMessage('Tool added successfully!');
            setToolData({
                toolName: '',
                toolType: ''
            });
            router.push('/tools');
        } catch (error) {
            setErrorMessage((error as Error).message || 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border rounded-md bg-zinc-200 dark:bg-zinc-900">
            <div>
                <Label htmlFor="toolName">Tool Name</Label>
                <Input
                    id="toolName"
                    name="toolName"
                    type="text"
                    value={toolData.toolName}
                    onChange={handleChange}
                    required
                    aria-describedby="toolNameError"
                />
            </div>
            <div>
                <Label htmlFor="tolType">Tool Type</Label>
                <Select
                    onValueChange={handleToolTypeChange}
                    value={toolData.toolType}
                    required
                    aria-describedby="toolTypeError">
                    <SelectTrigger>
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="language">Language</SelectItem>
                        <SelectItem value="frameworks / libraries">Frameworks / Libraries</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="cloud & devOps">Cloud & DevOps</SelectItem>
                        <SelectItem value="version control">Version Control</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="others">Other</SelectItem>
                    </SelectContent>
                </Select>

            </div>

            {errorMessage && <p id="toolError" className="text-red-500">{errorMessage}</p>}
            {successMessage && <p id="toolSuccess" className="text-green-500">{successMessage}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding Tool...' : 'Add Tool'}
            </Button>
        </form>
    );
};

export default AddTool;
