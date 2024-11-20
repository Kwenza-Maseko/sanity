'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useUser } from '@clerk/nextjs';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface InvoiceData {
    projectId: string;
    taskId: string;
    unitPrice: string;
    discount: string;
    quantity: string;
    invoiceNumber: string;
}

const AddInvoice = () => {
    const { user } = useUser();
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        projectId: '',
        taskId: '',
        unitPrice: '',
        discount: '',
        quantity: '',
        invoiceNumber: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [taskName, setTaskName] = useState('');
    const [projectName, setProjectName] = useState('');
    const params = useParams();
    const projectId = Array.isArray(params.id) ? params.id[0] : params.id || '';
    const taskId = Array.isArray(params.taskId) ? params.taskId[0] : params.taskId || '';
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInvoiceData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/addInvoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...invoiceData,
                    creator: user ? user.id : null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add invoice. Please try again.');
            }

            setSuccessMessage('Invoice added successfully!');
            setInvoiceData({
                projectId,
                taskId,
                unitPrice: '',
                discount: '',
                quantity: '',
                invoiceNumber: '',
            });

            router.push(`/invoices/${invoiceNumber}`);
        } catch (error) {
            console.error("Error while submitting invoice:", error);
            setErrorMessage('An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await fetch(`/api/allTask/${taskId}`);
                const data = await response.json();
                setInvoiceData((prev) => ({ ...prev, taskId: data._id }));
                setTaskName(data.taskName);
            } catch (error) {
                console.error("Error fetching task:", error);
            }
        };
        if (taskId) fetchTask();
    }, [taskId]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${projectId}`);
                const data = await response.json();
                setInvoiceData((prev) => ({ ...prev, projectId: data._id }));
                setProjectName(data.projectName);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };
        if (projectId) fetchProject();
    }, [projectId]);

    const handleGenerateInvoice = () => {
        const newInvoiceNumber = `INV-${Date.now()}`;
        setInvoiceNumber(newInvoiceNumber);
        setInvoiceData((prev) => ({
            ...prev,
            invoiceNumber: newInvoiceNumber,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border rounded-md bg-zinc-200 dark:bg-zinc-900">
            <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                    id="projectName"
                    name="projectName"
                    type="text"
                    value={projectName}
                    readOnly
                />
            </div>
            <div>
                <Label htmlFor="taskName">Description</Label>
                <Input
                    id="taskName"
                    name="taskName"
                    type="text"
                    value={taskName}
                    readOnly
                />
            </div>
            <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                    id="quantity"
                    name="quantity"
                    type="text"
                    value={invoiceData.quantity}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex gap-2 items-center">
                <p>R</p>
                <div>
                    <Label htmlFor="unitPrice">Unit Price</Label>
                    <Input
                        id="unitPrice"
                        name="unitPrice"
                        type="text"
                        value={invoiceData.unitPrice}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <p>R</p>
                <div>
                    <Label htmlFor="discount">Discount</Label>
                    <Input
                        id="discount"
                        name="discount"
                        type="text"
                        value={invoiceData.discount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="button" onClick={handleGenerateInvoice}>
                    Generate Invoice
                </button>
            </div>
            {invoiceNumber && (
                <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                        id="invoiceNumber"
                        name="invoiceNumber"
                        type="text"
                        value={invoiceNumber}
                        readOnly
                    />
                </div>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Making invoice...' : 'Make Invoice'}
            </Button>
        </form>
    );
};

export default AddInvoice;
