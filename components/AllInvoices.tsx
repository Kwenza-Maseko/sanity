'use client';
import { useState, useEffect, useCallback } from "react";
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
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";

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
interface UserData {
    clerkId: string;
    profilePhoto: string;
    firstName: string;
    lastName: string;
}

const AllInvoices = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<{ [key: string]: UserData }>({});
    const [tasks, setTasks] = useState<{ [key: string]: TaskData }>({});
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showOnlyMyInvoices, setShowOnlyMyInvoices] = useState(false);
    const { user } = useUser();

    const getInvoice = async () => {
        try {
            const response = await fetch('/api/invoice');
            if (!response.ok) throw new Error('Failed to fetch invoice');
            const data = await response.json();
            setInvoices(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Error fetching invoices:", err.message);
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const getUser = useCallback(async (creatorId: string) => {
        if (users[creatorId]) return;
        try {
            const response = await fetch(`/api/user/${creatorId}`);
            if (!response.ok) throw new Error('Failed to fetch user');
            const userData = await response.json();
            setUsers((prevUsers) => ({ ...prevUsers, [creatorId]: userData }));
        } catch (err: unknown) {
            if (err instanceof Error) console.error("Error fetching user:", err.message);
        }
    }, [users]);

    const getTasksByProjectId = useCallback(async (projectId: string) => {
        try {
            const response = await fetch(`/api/taskDisplay/${projectId}`);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const tasksData = await response.json();
            setTasks((prevTasks) =>
                tasksData.reduce(
                    (acc: { [key: string]: TaskData }, task: TaskData) => ({
                        ...acc,
                        [task._id]: task,
                    }),
                    prevTasks
                )
            );
        } catch (err: unknown) {
            if (err instanceof Error) console.error("Error fetching tasks:", err.message);
        }
    }, []);

    useEffect(() => {
        getInvoice();
    }, []);

    useEffect(() => {
        invoices.forEach((invoice) => {
            if (!users[invoice.creator]) getUser(invoice.creator);
            if (!tasks[invoice.taskId]) getTasksByProjectId(invoice.projectId);
        });
    }, [invoices, getUser, getTasksByProjectId, tasks, users]);

    if (loading) return <div>Loading Invoices...</div>;
    if (error) return <div>{error}</div>;

    const displayedInvoices = showOnlyMyInvoices
        ? invoices.filter(invoice => invoice.creator === user?.id)
        : invoices;

    return (
        <div className="rounded-md bg-zinc-200 dark:border-slate-800 dark:bg-[#010416d2]">
            <Button
                onClick={() => setShowOnlyMyInvoices(!showOnlyMyInvoices)}
                className="mb-4 p-2 rounded m-4"
            >
                {showOnlyMyInvoices ? "Show All Invoices" : "Show My Invoices"}
            </Button>
            <Table>
                <TableCaption>A list of your invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice Number</TableHead>
                        <TableHead>Task Name</TableHead>
                        <TableHead>Task Decription</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Created By</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayedInvoices.map((invoice) => (
                        <TableRow key={invoice._id}>
                            <TableCell>{invoice.invoiceNumber}</TableCell>
                            <TableCell>{tasks[invoice.taskId]?.taskName || "Unknown Task"}</TableCell>
                            <TableCell>{tasks[invoice.taskId]?.taskDescription || "Unknown Task"}</TableCell>
                            <TableCell>{invoice.quantity}</TableCell>
                            <TableCell>{parseFloat(invoice.unitPrice).toFixed(2)}</TableCell>
                            <TableCell>{parseFloat(invoice.discount).toFixed(2)}</TableCell>
                            <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="relative user_avatar">
                                    {users[invoice.creator]?.profilePhoto ? (
                                        <Link href={`/users/${users[invoice.creator]?.clerkId}`}>
                                            <Image
                                                src={users[invoice.creator].profilePhoto}
                                                width={30}
                                                height={30}
                                                alt="User photo"
                                                className="rounded-full"
                                            />
                                        </Link>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                    )}

                                    <div className="absolute hidden z-10 user_name">
                                        <Button className="p-2">
                                            {users[invoice.creator]?.firstName}
                                        </Button>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Link href={`/invoices/${invoice.invoiceNumber}`}>
                                    <Button className="p-2">
                                        Get Invoice
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AllInvoices;
