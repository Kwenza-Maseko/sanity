'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface TaskData {
    _id: string;
    taskName: string;
}
interface ProjectData {
    _id: string;
    projectName: string;
}

const AddInvoice = () => {
    const { user } = useUser();
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceData, setInvoiceData] = useState({
        projectId: '',
        taskId: '',
        unitPrice: '',
        discount: '',
        quantity: '',
        invoiceNumber: '', // Added invoiceNumber to state
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [taskName, setTaskName] = useState('');
    const [projectName, setProjectName] = useState('');
    const params = useParams();
    const projectId = Array.isArray(params.id) ? params.id[0] : params.id || "";
    const taskId = Array.isArray(params.taskId) ? params.taskId[0] : params.taskId || "";
    const route = useRouter();

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setInvoiceData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
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

            // Log the response for debugging
            console.log('Server response:', data);

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
                invoiceNumber: '', // Reset the invoice number after success
            });

            route.push(`/invoices/${invoiceNumber}`);
        } catch (error) {
            console.error("Error while submitting invoice:", error);
            setErrorMessage('An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch task data based on taskId and set the task name
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

    // Fetch project data based on projectId and set the project name
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
        // Generate the invoice number using the current timestamp
        const newInvoiceNumber = `INV-${Date.now()}`;
        setInvoiceNumber(newInvoiceNumber); // Set the invoice number for display
        setInvoiceData((prev) => ({ 
            ...prev, 
            invoiceNumber: newInvoiceNumber // Update the invoice number in the invoiceData state
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
                    value={projectName} // Display the project name here
                    readOnly // Make it read-only to avoid user edits
                />
            </div>
            <div>
                <Label htmlFor="taskName">Description</Label>
                <Input
                    id="taskName"
                    name="taskName"
                    type="text"
                    value={taskName} // Display the task name here
                    readOnly // Make it read-only to avoid user edits
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
                    aria-describedby="quantityError"
                />
            </div>
            <div className="flex gap-2 items-center">
                <div>
                    <p>R</p>
                </div>

                <div>
                    <Label htmlFor="unitPrice">Unit Price</Label>
                    <Input
                        id="unitPrice"
                        name="unitPrice"
                        type="text"
                        value={invoiceData.unitPrice}
                        onChange={handleChange}
                        required
                        aria-describedby="unitPriceError"
                    />
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <div className=' flex items-center'>
                    <p>R</p>
                </div>

                <div>
                    <Label htmlFor="discount">Discount</Label>
                    <Input
                        id="discount"
                        name="discount"
                        type="text"
                        value={invoiceData.discount}
                        onChange={handleChange}
                        required
                        aria-describedby="discountError"
                    />
                </div>
                <div>
                    <button type="button" onClick={handleGenerateInvoice}>Generate Invoice</button>
                </div>
            </div>

            {/* Display the invoice number above the discount input after generation */}
            {invoiceNumber && (
                <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                        id="invoiceNumber"
                        name="invoiceNumber"
                        type="text"
                        value={invoiceNumber}
                        readOnly // Make it read-only to avoid user edits
                    />
                </div>
            )}

            {errorMessage && <p id="invoiceError" className="text-red-500">{errorMessage}</p>}
            {successMessage && <p id="invoiceSuccess" className="text-green-500">{successMessage}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Making invoice...' : 'Make Invoice'}
            </Button>
        </form>
    );
};

export default AddInvoice;
