import React from 'react'
import AddClient from '@/components/AddClient'

const page = () => {
    return (
        <div>
            <p className="text-[14pt] font-bold">
                Add Client
            </p>
            <div className="mt-6">
                <AddClient />
            </div>
        </div>
    )
}

export default page