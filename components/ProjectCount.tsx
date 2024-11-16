"use client";

import { useEffect, useState } from 'react';

export default function ProjectCount() {
    const [clientCount, setClientCount] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClientCount = async () => {
            try {
                const response = await fetch('/api/projects/count');
                if (!response.ok) {
                    throw new Error('Failed to fetch project count');
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
        <div className="flex gap-6 border bg-zinc-200 dark:bg-zinc-900 p-6 rounded-md">
            {error ? (
                <p>Error: {error}</p>
            ) : clientCount !== null ? (
                <div className='text-md font-bold flex flex-col gap-6'><p className='text-md'>Total Projects</p> 
                <p className='text-xl'>{clientCount}</p></div>
            ) : (
                <p>Counting Projects...</p>
            )}
        </div>
    );
}
