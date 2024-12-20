'use client';

import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

interface UserData {
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePhoto: string;
    username: string;
}

const Profile = () => {
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null); // UserData type

    const getUser = async () => {
        const response = await fetch(`/api/user/${user?.id}`);
        const data = await response.json();
        setUserData(data);
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            getUser();
        }
    }, [user]);

    if (loading || !isLoaded || !userData) {
        return <div>Loading User...</div>;
    }
    const truncateMessage = (text: string) => {
        return text.length > 14 ? text.slice(0, 14) + '...' : text;
    };


    return (
        <div className="flex justify-between gap-6 border dark:border-slate-800 bg-zinc-200 dark:bg-[#010416d2] p-6 rounded-md">
            <div className=''>
                <Image src={userData.profilePhoto} width={70} height={70} alt='user' className='rounded-md object-cover photo ' />
            </div>
            <div>
                <div className="flex flex-col gap-8">
                    <div>
                        <div className="profile_items">
                            <p className="font-bold capitalize text-lg">{truncateMessage(`${userData.firstName} ${userData.lastName}`)}</p>
                        </div>
                        <div className="profile_items">
                            <p className="text-xs lowercase">{truncateMessage(`${userData.username}`)}</p>
                        </div>
                    </div>
                    <div className="profile_items mt-2">
                        <p className="text-xs capitalize">software engineer</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
