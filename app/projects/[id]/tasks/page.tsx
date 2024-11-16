import React from 'react'
import AddProject from '@/components/AddProject'
import AddTask from '@/components/AddTask'

const page = () => {
    return (
        <div>
            <p className="text-[14pt] font-bold">
                Add Task
            </p>
            <div className="mt-6">
                <AddTask />
            </div>
        </div>
    )
}

export default page