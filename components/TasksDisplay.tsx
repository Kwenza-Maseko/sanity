'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

interface TaskData {
    taskName: string;
    status: string;
    createdAt: Date;
}

const TaskDisplay = () => {
    const {  isLoaded } = useUser();
    const [loading, setLoading] = useState(true);
    const [taskData, setTaskData] = useState<TaskData[]>([]); // Updated to an array of TaskData

    const getTask = async () => {
        const response = await fetch(`/api/allTask`);
        const data = await response.json();
        setTaskData(data);
        setLoading(false);
    };

    useEffect(() => {
        getTask();
    }, []);

    const truncateMessage = (text: string) => {
        return text.length > 18 ? text.slice(0, 18) + '...' : text;
    };

    if (loading || !isLoaded || taskData.length === 0) {
        return <div>Loading Task...</div>;
    }

    return (
        <div className="">
            {taskData.map((task, index) => (
                <div key={index} className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between gap-2">
                        <div>
                            <p className="font-bold capitalize text-[11pt]">{truncateMessage(task.taskName)}</p>
                        </div>
                        <div className='text-end px-3'>
                            <p className="text-xs text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="profile_items">
                        <p className={`
                            ${task.status === "pending" ? "text-[#ff810c]" : ""}
                            ${task.status === "completed" ? "text-green-500" : ""}
                            ${task.status === "inProgress" ? "text-purple-500" : ""}
                            ${task.status === "archive" ? "text-red-500" : ""}
                            capitalize`}
                        >
                            {task.status}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskDisplay;
