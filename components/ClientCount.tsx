"use client";

import { useEffect, useState } from 'react';
import { BsPeople } from "@react-icons/all-files/bs/BsPeople";

export default function ClientCount() {
    const [clientCount, setClientCount] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClientCount = async () => {
            try {
                const response = await fetch('/api/clienthook/count');
                if (!response.ok) {
                    throw new Error('Failed to fetch client count');
                }
                const data = await response.json();
                setClientCount(data.count);
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchClientCount();
    }, []);

    return (
        <div className="gap-6 border dark:border-slate-800 bg-zinc-200 dark:bg-[#010416d2] p-6 rounded-md">
            {error ? (
                <p>Error: {error}</p>
            ) : clientCount !== null ? (
                <div className=' flex flex-col gap-6'>
                    <div className="flex gap-16 justify-between">
                        <div className='text-xl'>
                            <BsPeople />
                        </div>
                        <div className='text-md'>
                            <div className="flex flex-col">
                                <p className='text-md'>Total</p>
                                <p className='text-lg font-bold'>Clients</p>
                            </div>
                        </div>
                    </div>
                    <p className='text-xl text-start font-bold'>{clientCount}</p>
                </div>
            ) : (
                <div className=' flex flex-col gap-6'>
                <div className="flex gap-16">
                    <div className='text-xl'>
                        <BsPeople />
                    </div>
                    <div className='text-md'>
                        <div className="flex flex-col">
                            <p className='text-md'>Total</p>
                            <p className='text-lg font-bold'>Clients</p>
                        </div>
                    </div>
                </div>
                <p className='text-start font-bold'>Counting...</p>
            </div>
            )}
        </div>
    );
}
