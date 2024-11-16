'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation';

const AddClient = () => {
    const { user } = useUser();
    const router = useRouter();
    const [clientData, setClientData] = useState({
        clientFirstName: '',
        clientLastName: '',
        clientEmail: '',
        clientCellNumber: '',
        companyName: 'personal service', // Default value for companyName
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setClientData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/addClients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...clientData,
                    creator: user ? user.id : null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add client. Please try again.');
            }

            setSuccessMessage('Client added successfully!');
            setClientData({
                clientFirstName: '',
                clientLastName: '',
                clientEmail: '',
                clientCellNumber: '',
                companyName: 'personal service',
            });
            router.push('/allclients');
        } catch (error) {
            setErrorMessage((error as Error).message || 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border rounded-md bg-zinc-200 dark:bg-zinc-900">
            <div className="flex w-full gap-4">
                <div className='w-full'>
                    <Label htmlFor="clientFirstName">First Name</Label>
                    <Input
                        id="clientFirstName"
                        name="clientFirstName"
                        type="text"
                        value={clientData.clientFirstName}
                        onChange={handleChange}
                        required
                        aria-describedby="clientFirstNameError"
                    />
                </div>
                <div className='w-full'>
                    <Label htmlFor="clientLastName">Last Name</Label>
                    <Input
                        id="clientLastName"
                        name="clientLastName"
                        type="text"
                        value={clientData.clientLastName}
                        onChange={handleChange}
                        required
                        aria-describedby="clientLastNameError"
                    />
                </div>
            </div>
            <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                    id="clientEmail"
                    name="clientEmail"
                    type="email"
                    value={clientData.clientEmail}
                    onChange={handleChange}
                    aria-describedby="clientEmailError"
                />
            </div>
            <div>
                <Label htmlFor="clientCellNumber">Cell Number</Label>
                <Input
                    id="clientCellNumber"
                    name="clientCellNumber"
                    type="text"
                    value={clientData.clientCellNumber}
                    onChange={handleChange}
                    aria-describedby="clientCellNumberError"
                />
            </div>
            <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={clientData.companyName}
                    onChange={handleChange}
                    placeholder="personal service"
                />
            </div>

            {errorMessage && <p id="clientError" className="text-red-500">{errorMessage}</p>}
            {successMessage && <p id="clientSuccess" className="text-green-500">{successMessage}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding Client...' : 'Add Client'}
            </Button>
        </form>
    );
};

export default AddClient;
