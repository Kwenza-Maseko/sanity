'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ClientData {
    clientFirstName: string;
    clientLastName: string;
    clientEmail: string;
    clientCellNumber: string;
    companyName: string;
    createAt: Date;
}

const page = () => {
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(true);
    const [clientData, setClientData] = useState<ClientData | null>(null); // UserData type
    const path = useParams();
    const clientId = path.id;

    const getUser = async () => {
        const response = await fetch(`/api/clienthook/${clientId}`);
        const data = await response.json();
        setClientData(data);
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            getUser();
        }
    }, [user]);

    if (loading || !isLoaded || !setClientData) {
        return <div>Loading Client...</div>;
    }


    return (
        <div>

            <div className="border bg-zinc-100 dark:bg-zinc-900 p-4 rounded-md w-fit">
                <div>
                    <div className="flex flex-col gap-3">
                        <div className='flex flex-col gap-2'>
                            <div className="profile_items">
                                <p className="font-bold capitalize text-lg">{clientData?.clientFirstName} {clientData?.clientLastName}</p>
                            </div>
                            <div className='flex gap-3 items-end'>
                                <div className='flex flex-col gap-1 font-bold capitalize'>
                                    <p>Email :</p>
                                    <p>cellphone No :</p>
                                    <p>company name :</p>
                                </div>
                                <div className='flex flex-col gap-1 font-light'>
                                    <p className="">{clientData?.clientEmail}</p>
                                    <p className="">{clientData?.clientCellNumber}</p>
                                    <p className="">{clientData?.companyName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
