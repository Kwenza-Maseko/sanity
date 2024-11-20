'use client'
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
import { HiOutlineDotsVertical } from "@react-icons/all-files/hi/HiOutlineDotsVertical";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";

interface ClientData {
    _id: string;
    creator: string;
    clientFirstName: string;
    clientLastName: string;
    clientEmail: string;
    clientCellNumber: string;
    companyName: string;
    createdAt: Date;
}

interface UserData {
    clerkId: string;
    profilePhoto: string;
    firstName: string;
    lastName: string;
}

const ClientComp = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<{ [key: string]: UserData }>({});
    const [clients, setClients] = useState<ClientData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showOnlyMyClients, setShowOnlyMyClients] = useState(false); // Toggle state
    const { user } = useUser();

    const getClients = async () => {
        try {
            const response = await fetch('/api/clienthook');
            if (!response.ok) throw new Error('Failed to fetch clients');
            const data = await response.json();
            if (data.length === 0) throw new Error('No clients found');
            setClients(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getUser = useCallback(async (creatorId: string) => {
        try {
            const response = await fetch(`/api/user/${creatorId}`);
            if (!response.ok) throw new Error('Failed to fetch user');
            const userData: UserData = await response.json();
            setUsers((prevUsers) => ({ ...prevUsers, [creatorId]: userData }));
        } catch (err: unknown) {
            console.error("Error fetching user:", err);
        }
    }, []);
    
    useEffect(() => {
        getClients();
    }, []);

    useEffect(() => {
        clients.forEach(client => {
            if (!users[client.creator]) {
                getUser(client.creator);
            }
        });
    }, [clients, getUser, users]);

  


    if (loading) return <div>Loading Clientss...</div>;
    if (error) return <div>{error}</div>;

    // Filter clients based on the toggle state and current user ID
    const displayedClients = showOnlyMyClients
        ? clients.filter(client => client.creator === user?.id)
        : clients;

    return (
        <div className="rounded-md bg-zinc-200 dark:border-slate-800 dark:bg-[#010416d2]">
            <Button
                onClick={() => setShowOnlyMyClients(!showOnlyMyClients)}
                className="mb-4 p-2 rounded m-4"
            >
                {showOnlyMyClients ? "Show All Clients" : "Show My Clients"}
            </Button>
            <Table>
                <TableCaption>A list of your clients.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Cell Phone</TableHead>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Created By</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayedClients.map((client, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{client.clientFirstName} {client.clientLastName}</TableCell>
                            <TableCell>{client.clientEmail}</TableCell>
                            <TableCell>{client.clientCellNumber}</TableCell>
                            <TableCell>{client.companyName}</TableCell>
                            <TableCell>{new Date(client.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right flex items-end">
                                <div className="relative user_avatar">
                                    {users[client.creator]?.profilePhoto ? (
                                        <Link href={`/users/${users[client.creator]?.clerkId}`}>
                                            <Image
                                                src={users[client.creator].profilePhoto}
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
                                            {users[client.creator]?.firstName}
                                        </Button>
                                    </div>
                                </div>

                            </TableCell>
                            <TableCell>
                                <Link href={`allclients/${client._id}`}>
                                    <HiOutlineDotsVertical className="text-lg" />
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ClientComp;
