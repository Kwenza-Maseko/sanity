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
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import html2pdf from "html2pdf.js";

interface InvoiceData {
    _id: string;
    creator: string;
    projectId: string;
    taskId: string;
    unitPrice: string;
    discount: string;
    quantity: string;
    invoiceNumber: string;
    createdAt: Date;
}

interface TaskData {
    _id: string;
    taskName: string;
    taskDescription: string;
}

interface ProjectData {
    _id: string;
}

interface UserData {
    clerkId: string;
    profilePhoto: string;
    firstName: string;
    lastName: string;
}

const page = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<{ [key: string]: UserData }>({});
    const [tasks, setTasks] = useState<{ [key: string]: TaskData }>({});
    const [invoice, setInvoice] = useState<InvoiceData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();
    const { invoiceNumber } = useParams(); // Access `invoiceNumber` from params

    useEffect(() => {
        console.log("Received invoice number from params:", invoiceNumber); // Check if it's correct
        getInvoice();
    }, [invoiceNumber]);

    const getInvoice = async () => {
        try {
            const response = await fetch(`/api/invoice/${invoiceNumber}`);
            if (!response.ok) throw new Error('Failed to fetch invoice');
            const data = await response.json();
            setInvoice(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getUser = async (creatorId: string) => {
        if (users[creatorId]) return;
        try {
            const response = await fetch(`/api/user/${creatorId}`);
            if (!response.ok) throw new Error('Failed to fetch user');
            const userData = await response.json();
            setUsers((prevUsers) => ({ ...prevUsers, [creatorId]: userData }));
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };

    // Fetch task by projectId instead of taskId
    const getTasksByProjectId = async (projectId: string) => {
        try {
            const response = await fetch(`/api/taskDisplay/${projectId}`); // Assuming this endpoint fetches tasks by projectId
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const tasksData = await response.json();
            tasksData.forEach((task: TaskData) => {
                setTasks((prevTasks) => ({ ...prevTasks, [task._id]: task }));
            });
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    };

    useEffect(() => {
        if (invoice) {
            getUser(invoice.creator);
            getTasksByProjectId(invoice.projectId); // Fetch tasks by projectId
        }
    }, [invoice]);

    if (loading) return <div>Loading Invoice...</div>;
    if (error) return <div>{error}</div>;

    async function handleDownload() {
        const element = document.querySelector("#invoiceTemplate");
        html2pdf().from(element).save(`invoice_${invoiceNumber}.pdf`);
    }


    // Display the fetched invoice data
    return (
        <div className="p-2"
            id="invoiceTemplate">
            {/* Add Task Button */}
            <div className=" flex gap-3 mb-6" data-html2canvas-ignore>
                <Button onClick={handleDownload}>
                    Download Invoice
                </Button>
                
                <Button onClick={handleDownload}>
                    Send Invoice
                </Button>
            </div>

            <div className="rounded-md bg-white text-black border p-4 w-full">
                {invoice ? (
                    <div key={invoice._id} className="mb-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>

                                <div className="pacifico-regular">
                                    <div className="flex gap-3 items-center">
                                        <div className="rounded-md px-2 text-[18pt] bg-slate-100 border dark:bg-[#ffffff] dark:text-[#000000]">
                                            <p>E</p>
                                        </div>
                                        <div>
                                            <p className=" text-[18pt]">Elsonify</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div>
                                        <p className="text-lg font-bold">Company Address</p>
                                        <p>110 Joe Slovo Street</p>
                                        <p>Durban Central</p>
                                        <p>4001</p>
                                        <p>South Africa</p>
                                    </div>

                                    <p>kwenzaelson80@gmail.com</p>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Invoice</h2>
                                <h2 className="mb-6"> <span className="font-bold">Invoice:</span> #{invoice.invoiceNumber}</h2>
                                <p><span className="font-bold">Invoice Date:</span> {new Date(invoice.createdAt).toLocaleString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>

                                <p><span className="font-bold">Job Detail:</span> {tasks[invoice.taskId]?.taskName || "Loading..."}</p>
                                <p><span className="font-bold">Job Project:</span> {invoice.projectId}</p>
                            </div>

                        </div>

                        <Table className="mt-16">
                            <TableHeader className="bg-black text-white">
                                <TableRow className="">
                                    <TableHead className="text-white">Description</TableHead>
                                    <TableHead className="text-white">Qnty</TableHead>
                                    <TableHead className="text-white">Unit Price</TableHead>
                                    <TableHead className="text-white">Discount</TableHead>
                                    <TableHead className="text-white">Invoiced By</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                <TableRow key={invoice._id}>
                                    <TableCell>{tasks[invoice.taskId]?.taskDescription || "Loading..."}</TableCell>
                                    <TableCell>{parseInt(invoice.quantity, 10)}</TableCell>
                                    <TableCell>R{parseFloat(invoice.unitPrice).toFixed(2)}</TableCell>
                                    <TableCell>R{parseFloat(invoice.discount).toFixed(2)}</TableCell>
                                    <TableCell>{users[invoice.creator]?.firstName} {users[invoice.creator]?.lastName}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <div className="mt-6 text-end">
                            <p><span className="font-bold">Invoice Subtotal:</span> R{(parseFloat(invoice.unitPrice) * parseInt(invoice.quantity, 10) - parseFloat(invoice.discount)).toFixed(2)}</p>
                            <p><span className=" mt-1 font-bold uppercase">Total:</span> R{(parseFloat(invoice.unitPrice) * parseInt(invoice.quantity, 10) - parseFloat(invoice.discount)).toFixed(2)}</p>

                        </div>

                        <div className="mt-6 text-center">
                            <p className="font-bold">Please make all check to payable {tasks[invoice.taskId]?.taskName || "Loading..."}</p>
                            <p className="">kwenzaelson80@gmail.com</p>

                        </div>

                    </div>
                ) : (
                    <p>No invoice found</p>
                )}
            </div>

        </div>
    );
};

export default page;
