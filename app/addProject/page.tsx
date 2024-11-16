import React from 'react'
import AddProject from '@/components/AddProject'

const page = () => {
    return (
        <div>
            <p className="text-[14pt] font-bold">
                Add Project
            </p>
            <div className="mt-6">
                <AddProject />
            </div>
        </div>
    )
}

export default page